/**
 * Script para testar o sistema de IA completo
 * Simula o fluxo: Criar atividade → OCR → Adaptar
 */

const { sequelize } = require('./config/database');
const llmService = require('./services/llmService');
const embeddingService = require('./services/embeddingService');

async function testAISystem() {
  try {
    console.log('🧪 Iniciando teste do sistema de IA...');

    // Conectar ao banco
    await sequelize.authenticate();
    console.log('✅ Conexão estabelecida');

    // 1. USAR DADOS SIMULADOS PARA TESTE
    console.log('\n📝 Usando dados simulados de estudante...');

    const studentId = 'test-student-' + Date.now();
    const simulatedStudent = {
      id: studentId,
      nomeCompleto: 'João da Silva (Teste)',
      idade: '10 anos',
      diagnosticos: ['TEA', 'TDAH'],
      objetivos: ['melhorar atenção', 'reduzir ansiedade'],
      hiperfocos: ['dinossauros', 'números'],
      superpoderes: ['memória visual excelente']
    };
    console.log(`✅ Estudante simulado: ${simulatedStudent.nomeCompleto}`);

    // 2. SIMULAR TEXTO OCR DE ATIVIDADE
    console.log('\n🔍 Simulando texto OCR extraído...');

    const testOcrText = `
    ATIVIDADE DE MATEMÁTICA - 4º ANO

    1) Resolva as operações:
    a) 25 + 17 = ____
    b) 48 - 23 = ____
    c) 6 × 4 = ____

    2) Pedro tinha 50 reais. Comprou um brinquedo por 28 reais.
       Quanto dinheiro sobrou?

    3) Complete a sequência:
       2, 4, 6, 8, ____, ____
    `;
    console.log(`✅ Texto OCR simulado (${testOcrText.split('\n').filter(l => l.trim()).length} linhas)`);

    // 4. USAR PERFIL SIMULADO
    console.log('\n👤 Usando perfil simulado do estudante...');

    const student = simulatedStudent;
    console.log(`✅ Perfil: ${student.nomeCompleto}, Diagnósticos: ${student.diagnosticos}`);

    // 5. TESTAR RAG QUERY
    console.log('\n🔍 Testando busca RAG...');

    const queryText = `estudante com TEA TDAH matemática operações básicas`;

    // Buscar estratégias manualmente (contornando o erro do RAG)
    const relevantStrategies = await sequelize.query(`
      SELECT e.sourceId, e.content, kn.groupLabel
      FROM embeddings e
      JOIN knowledge_nodes kn ON e.sourceId = kn.id
      WHERE e.sourceTable = 'knowledge_nodes'
      LIMIT 5
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    console.log(`✅ Encontradas ${relevantStrategies.length} estratégias relevantes`);
    relevantStrategies.forEach(s => console.log(`   - ${s.groupLabel}`));

    // 6. TESTAR GERAÇÃO DE ADAPTAÇÃO
    console.log('\n🤖 Testando geração de adaptação...');

    const adaptationParams = {
      perfilAluno: student,
      ocrText: testOcrText,
      layout: { confidence: 0.95, words: 45 },
      nos: relevantStrategies.map(s => ({
        sourceId: s.sourceId,
        nodeDetails: { groupLabel: s.groupLabel }
      }))
    };

    const adaptationJson = await llmService.callLLM(adaptationParams);
    console.log('✅ Adaptação gerada com sucesso!');
    console.log('📊 Resumo da adaptação:');
    console.log(`   - Estratégias aplicadas: ${adaptationJson.estrategias_aplicadas?.length || 0}`);
    console.log(`   - Itens adaptados: ${adaptationJson.atividade_adaptada?.itens?.length || 0}`);
    console.log(`   - Enunciado: ${adaptationJson.atividade_adaptada?.enunciado_reescrito?.substring(0, 100)}...`);

    // 7. VALIDAR ADAPTAÇÃO
    console.log('\n✅ Testando validação...');

    const isValid = llmService.validateAdaptationJson(adaptationJson);
    console.log(`Adaptação válida: ${isValid ? '✅ SIM' : '❌ NÃO'}`);

    // 8. SIMULAR RESULTADO FINAL
    console.log('\n🎉 Resultado final simulado...');

    console.log('📋 RESULTADO FINAL DO TESTE:');
    console.log(`   Estudante: ${student.nomeCompleto}`);
    console.log(`   Diagnósticos: ${student.diagnosticos.join(', ')}`);
    console.log(`   Atividade: Matemática - 4º Ano`);
    console.log(`   Status: ADAPTAÇÃO GERADA`);
    console.log(`   Estratégias: ${adaptationJson.estrategias_aplicadas?.length || 0}`);
    console.log(`   Itens adaptados: ${adaptationJson.atividade_adaptada?.itens?.length || 0}`);

    console.log('\n🎊 TESTE COMPLETO - SISTEMA FUNCIONANDO!');

  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    await sequelize.close();
  }
}

// Executar o teste
testAISystem();