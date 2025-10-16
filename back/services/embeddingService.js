const { sequelize } = require('../config/database');

// Para o MVP, vamos usar um provedor de embeddings simples
// Em produção, substituir por OpenAI, Cohere, ou outro provedor
// Este é um placeholder que simula embeddings

/**
 * Gera embeddings para textos (PLACEHOLDER - implementar com provedor real)
 * @param {string[]} texts - Array de textos para gerar embeddings
 * @returns {Promise<Float32Array[]>} Array de vetores de embedding
 */
async function embedTexts(texts) {
  // PLACEHOLDER: Em produção, chamar API real (OpenAI, etc.)
  // Por enquanto, gerar vetores aleatórios para teste

  console.log(`🧠 Gerando embeddings para ${texts.length} textos...`);

  const embeddings = texts.map(text => {
    // Vetor aleatório de 1024 dimensões para teste
    const vector = new Float32Array(1024);

    // Usar hash do texto para gerar vetor "consistente"
    let seed = hashString(text);
    for (let i = 0; i < 1024; i++) {
      seed = (seed * 1103515245 + 12345) % (2**31);
      vector[i] = (seed / (2**31)) * 2 - 1; // Normalizar entre -1 e 1
    }

    return vector;
  });

  console.log(`✅ Embeddings gerados com sucesso`);
  return embeddings;
}

/**
 * Hash simples para gerar seed consistente
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Calcula similaridade cosseno entre dois vetores
 * @param {number[]} vecA - Primeiro vetor
 * @param {number[]} vecB - Segundo vetor
 * @returns {number} Similaridade cosseno (0 a 1)
 */
function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    throw new Error('Vetores devem ter o mesmo tamanho');
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += vecA[i] * vecA[i];
    magnitudeB += vecB[i] * vecB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Salva embeddings no banco de dados
 * @param {string} sourceTable - Tabela origem ('knowledge_nodes' | 'ocr_extractions')
 * @param {string} sourceId - ID do registro origem
 * @param {string} content - Conteúdo textual
 * @param {Float32Array} vector - Vetor de embedding
 * @param {number} chunkIndex - Índice do chunk (padrão: 0)
 */
async function saveEmbedding(sourceTable, sourceId, content, vector, chunkIndex = 0) {
  try {
    const vectorStr = JSON.stringify(Array.from(vector));

    // Detectar se estamos usando PostgreSQL ou SQLite
    const dialect = sequelize.getDialect();

    if (dialect === 'postgres') {
      // Versão PostgreSQL com pgvector
      await sequelize.query(`
        INSERT INTO embeddings (sourceTable, sourceId, chunkIndex, content, vector)
        VALUES ($1, $2, $3, $4, $5::vector)
        ON CONFLICT (sourceTable, sourceId, chunkIndex)
        DO UPDATE SET content = $4, vector = $5::vector
      `, {
        bind: [sourceTable, sourceId, chunkIndex, content, vectorStr],
        type: sequelize.QueryTypes.INSERT
      });
    } else {
      // Versão SQLite - usar INSERT OR REPLACE
      await sequelize.query(`
        INSERT OR REPLACE INTO embeddings (sourceTable, sourceId, chunkIndex, content, vectorJson, createdAt)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, {
        bind: [sourceTable, sourceId, chunkIndex, content, vectorStr, new Date().toISOString()],
        type: sequelize.QueryTypes.INSERT
      });
    }

    console.log(`💾 Embedding salvo: ${sourceTable}:${sourceId}`);

  } catch (error) {
    console.error('Erro ao salvar embedding:', error);
    throw error;
  }
}

/**
 * Busca por similaridade usando RAG
 * @param {string} queryText - Texto da consulta
 * @param {number} topK - Número de resultados (padrão: 5)
 * @param {string[]} sourceTables - Tabelas para buscar (padrão: ['knowledge_nodes'])
 * @returns {Promise<Array>} Resultados ordenados por similaridade
 */
async function ragQuery(queryText, topK = 5, sourceTables = ['knowledge_nodes']) {
  try {
    // Gerar embedding da query
    const [queryVector] = await embedTexts([queryText]);
    const queryVectorArray = Array.from(queryVector);

    const dialect = sequelize.getDialect();
    let results;

    if (dialect === 'postgres') {
      // Versão PostgreSQL com pgvector
      const queryVectorStr = `[${queryVectorArray.join(',')}]`;
      const tableFilter = sourceTables.map((_, i) => `$${i + 2}`).join(',');

      const query = `
        SELECT
          e.sourceTable,
          e.sourceId,
          e.content,
          1 - (e.vector <=> $1::vector) as similarity
        FROM embeddings e
        WHERE e.sourceTable = ANY(ARRAY[${tableFilter}])
        ORDER BY e.vector <=> $1::vector
        LIMIT $${sourceTables.length + 2}
      `;

      results = await sequelize.query(query, {
        bind: [queryVectorStr, ...sourceTables, topK],
        type: sequelize.QueryTypes.SELECT
      });
    } else {
      // Versão SQLite - calcular similaridade cosseno manualmente
      const placeholders = sourceTables.map(() => '?').join(',');

      const query = `
        SELECT
          sourceTable,
          sourceId,
          content,
          vectorJson
        FROM embeddings
        WHERE sourceTable IN (${placeholders})
        ORDER BY id
        LIMIT ?
      `;

      const rawResults = await sequelize.query(query, {
        bind: [...sourceTables, Math.min(topK * 10, 100)], // Buscar mais para filtrar depois
        type: sequelize.QueryTypes.SELECT
      });

      // Calcular similaridade cosseno
      results = rawResults.map(row => {
        const vectorB = JSON.parse(row.vectorJson);
        const similarity = cosineSimilarity(queryVectorArray, vectorB);
        return {
          sourceTable: row.sourceTable,
          sourceId: row.sourceId,
          content: row.content,
          similarity
        };
      }).sort((a, b) => b.similarity - a.similarity).slice(0, topK);
    }

    console.log(`🔍 RAG Query: encontrados ${results.length} resultados para "${queryText.substring(0, 50)}..."`);

    // Buscar detalhes completos dos nós de conhecimento
    const enrichedResults = [];
    for (const result of results) {
      if (result.sourceTable === 'knowledge_nodes') {
        const [nodeDetails] = await sequelize.query(`
          SELECT * FROM knowledge_nodes WHERE id = ?
        `, {
          bind: [result.sourceId],
          type: sequelize.QueryTypes.SELECT
        });

        if (nodeDetails) {
          enrichedResults.push({
            ...result,
            nodeDetails: nodeDetails
          });
        }
      } else {
        enrichedResults.push(result);
      }
    }

    return enrichedResults;

  } catch (error) {
    console.error('Erro no RAG query:', error);
    throw error;
  }
}

/**
 * Indexa um nó de conhecimento (gera e salva embeddings)
 * @param {object} knowledgeNode - Nó de conhecimento completo
 */
async function indexKnowledgeNode(knowledgeNode) {
  try {
    // Concatenar conteúdo relevante para embedding
    const content = [
      knowledgeNode.groupLabel,
      knowledgeNode.targetConditions?.join(' ') || '',
      knowledgeNode.signals?.join(' ') || '',
      JSON.stringify(knowledgeNode.strategy || {}),
      JSON.stringify(knowledgeNode.foundation || {}),
      knowledgeNode.examples?.join(' ') || ''
    ].filter(Boolean).join(' ');

    // Gerar embedding
    const [vector] = await embedTexts([content]);

    // Salvar no banco
    await saveEmbedding('knowledge_nodes', knowledgeNode.id, content, vector);

    console.log(`📚 Nó de conhecimento indexado: ${knowledgeNode.id}`);

  } catch (error) {
    console.error(`Erro ao indexar nó ${knowledgeNode.id}:`, error);
    throw error;
  }
}

/**
 * Indexa texto OCR extraído
 * @param {string} ocrExtractionId - ID da extração OCR
 * @param {string} rawText - Texto extraído
 */
async function indexOcrExtraction(ocrExtractionId, rawText) {
  try {
    if (!rawText || rawText.trim().length === 0) {
      console.log(`⚠️ OCR vazio, pulando indexação: ${ocrExtractionId}`);
      return;
    }

    // Gerar embedding
    const [vector] = await embedTexts([rawText]);

    // Salvar no banco
    await saveEmbedding('ocr_extractions', ocrExtractionId, rawText, vector);

    console.log(`📄 OCR indexado: ${ocrExtractionId}`);

  } catch (error) {
    console.error(`Erro ao indexar OCR ${ocrExtractionId}:`, error);
    throw error;
  }
}

/**
 * Remove embeddings de um registro
 * @param {string} sourceTable - Tabela origem
 * @param {string} sourceId - ID do registro
 */
async function removeEmbeddings(sourceTable, sourceId) {
  try {
    await sequelize.query(`
      DELETE FROM embeddings
      WHERE sourceTable = $1 AND sourceId = $2
    `, {
      bind: [sourceTable, sourceId],
      type: sequelize.QueryTypes.DELETE
    });

    console.log(`🗑️ Embeddings removidos: ${sourceTable}:${sourceId}`);

  } catch (error) {
    console.error('Erro ao remover embeddings:', error);
    throw error;
  }
}

module.exports = {
  embedTexts,
  saveEmbedding,
  ragQuery,
  indexKnowledgeNode,
  indexOcrExtraction,
  removeEmbeddings
};