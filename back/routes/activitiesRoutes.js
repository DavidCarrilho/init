const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const path = require('path');

// Importar serviços
const pdfService = require('../services/pdfService');
const ocrService = require('../services/ocrService');
const embeddingService = require('../services/embeddingService');
const llmService = require('../services/llmService');
const pdfRenderService = require('../services/pdfRenderService');

// Importar models (quando criarmos)
const { sequelize } = require('../config/database');

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticateToken);

/**
 * POST /activities/:studentId
 * Cria nova atividade e processa arquivo (PDF→imagens ou imagem direta)
 */
router.post('/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { uploadId, title, metadata = {} } = req.body;

    // Verificar se estudante existe e pertence ao usuário
    const [student] = await sequelize.query(`
      SELECT id FROM students
      WHERE id = $1 AND userId = $2
    `, {
      bind: [studentId, req.user.id],
      type: sequelize.QueryTypes.SELECT
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Estudante não encontrado'
      });
    }

    // Criar registro da atividade
    const activityId = require('crypto').randomUUID();
    await sequelize.query(`
      INSERT INTO activities (id, studentId, uploadId, title, metadata)
      VALUES ($1, $2, $3, $4, $5)
    `, {
      bind: [activityId, studentId, uploadId, title || 'Atividade sem título', JSON.stringify(metadata)],
      type: sequelize.QueryTypes.INSERT
    });

    // TODO: Buscar caminho do arquivo pelo uploadId no sistema existente
    // Por enquanto, simulamos o caminho
    const filePath = path.join(__dirname, '../uploads/atividades', `${uploadId}.pdf`);

    try {
      // Processar arquivo para imagens
      const outputDir = path.join(__dirname, '../uploads/activities/pages', activityId);
      const { type, pages, metadata: fileMetadata } = await pdfService.processFileToImages(filePath, outputDir);

      // Salvar páginas no banco
      for (let i = 0; i < pages.length; i++) {
        const pageId = require('crypto').randomUUID();
        const relativePath = path.relative(path.join(__dirname, '..'), pages[i]);

        await sequelize.query(`
          INSERT INTO activity_pages (id, activityId, pageNumber, imageUrl)
          VALUES ($1, $2, $3, $4)
        `, {
          bind: [pageId, activityId, i + 1, relativePath],
          type: sequelize.QueryTypes.INSERT
        });
      }

      console.log(`✅ Atividade ${activityId} criada com ${pages.length} páginas`);

      res.status(201).json({
        success: true,
        message: 'Atividade criada com sucesso',
        activity: {
          id: activityId,
          studentId,
          uploadId,
          title,
          type,
          pages: pages.length,
          metadata: { ...metadata, ...fileMetadata }
        }
      });

    } catch (fileError) {
      console.error('Erro ao processar arquivo:', fileError);

      // Atividade foi criada mas processamento falhou
      res.status(201).json({
        success: true,
        message: 'Atividade criada, mas processamento de arquivo falhou',
        activity: {
          id: activityId,
          studentId,
          uploadId,
          title,
          error: fileError.message
        }
      });
    }

  } catch (error) {
    console.error('Erro ao criar atividade:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * POST /activities/:activityId/ocr
 * Executa OCR em todas as páginas da atividade
 */
router.post('/:activityId/ocr', async (req, res) => {
  try {
    const { activityId } = req.params;

    // Verificar se atividade existe e pertence ao usuário
    const [activity] = await sequelize.query(`
      SELECT a.id, a.studentId
      FROM activities a
      JOIN students s ON a.studentId = s.id
      WHERE a.id = $1 AND s.userId = $2
    `, {
      bind: [activityId, req.user.id],
      type: sequelize.QueryTypes.SELECT
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Atividade não encontrada'
      });
    }

    // Buscar páginas da atividade
    const pages = await sequelize.query(`
      SELECT id, pageNumber, imageUrl
      FROM activity_pages
      WHERE activityId = $1
      ORDER BY pageNumber
    `, {
      bind: [activityId],
      type: sequelize.QueryTypes.SELECT
    });

    if (pages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhuma página encontrada para esta atividade'
      });
    }

    console.log(`🔍 Iniciando OCR para ${pages.length} páginas...`);

    const ocrResults = [];

    // Executar OCR em cada página
    for (const page of pages) {
      try {
        const fullImagePath = path.join(__dirname, '..', page.imageUrl);
        const ocrResult = await ocrService.ocrImage(fullImagePath);

        // Salvar resultado no banco
        const ocrId = require('crypto').randomUUID();
        await sequelize.query(`
          INSERT INTO ocr_extractions (id, activityPageId, rawText, layout, engine)
          VALUES ($1, $2, $3, $4, $5)
        `, {
          bind: [
            ocrId,
            page.id,
            ocrResult.rawText,
            JSON.stringify(ocrResult.layout),
            ocrResult.engine
          ],
          type: sequelize.QueryTypes.INSERT
        });

        // Indexar para RAG se houver texto
        if (ocrResult.rawText && ocrResult.rawText.trim().length > 0) {
          await embeddingService.indexOcrExtraction(ocrId, ocrResult.rawText);
        }

        ocrResults.push({
          pageNumber: page.pageNumber,
          ocrId,
          textLength: ocrResult.rawText?.length || 0,
          confidence: ocrResult.layout?.summary?.avg_confidence || 0
        });

        console.log(`✅ OCR concluído para página ${page.pageNumber}`);

      } catch (pageError) {
        console.error(`Erro OCR página ${page.pageNumber}:`, pageError);
        ocrResults.push({
          pageNumber: page.pageNumber,
          error: pageError.message
        });
      }
    }

    res.json({
      success: true,
      message: 'OCR executado com sucesso',
      results: {
        activityId,
        totalPages: pages.length,
        processedPages: ocrResults.filter(r => !r.error).length,
        ocrResults
      }
    });

  } catch (error) {
    console.error('Erro no OCR:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * POST /activities/:activityId/adapt
 * Gera adaptação pedagógica usando IA
 */
router.post('/:activityId/adapt', async (req, res) => {
  try {
    const { activityId } = req.params;

    // Verificar se atividade existe e pertence ao usuário
    const [activity] = await sequelize.query(`
      SELECT a.id, a.studentId, a.title
      FROM activities a
      JOIN students s ON a.studentId = s.id
      WHERE a.id = $1 AND s.userId = $2
    `, {
      bind: [activityId, req.user.id],
      type: sequelize.QueryTypes.SELECT
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Atividade não encontrada'
      });
    }

    // Buscar perfil completo do estudante
    const [student] = await sequelize.query(`
      SELECT * FROM students WHERE id = $1
    `, {
      bind: [activity.studentId],
      type: sequelize.QueryTypes.SELECT
    });

    // Buscar texto OCR consolidado
    const ocrTexts = await sequelize.query(`
      SELECT ocr.rawText, ocr.layout, ap.pageNumber
      FROM ocr_extractions ocr
      JOIN activity_pages ap ON ocr.activityPageId = ap.id
      WHERE ap.activityId = $1
      ORDER BY ap.pageNumber
    `, {
      bind: [activityId],
      type: sequelize.QueryTypes.SELECT
    });

    // Consolidar texto de todas as páginas
    const consolidatedText = ocrTexts
      .map(ocr => ocr.rawText)
      .filter(text => text && text.trim())
      .join('\n\n');

    if (!consolidatedText) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum texto encontrado via OCR. Execute o OCR primeiro.'
      });
    }

    // Criar registro de adaptação
    const adaptationId = require('crypto').randomUUID();
    await sequelize.query(`
      INSERT INTO activity_adaptations (id, activityId, studentId, status)
      VALUES ($1, $2, $3, 'PROCESSANDO')
    `, {
      bind: [adaptationId, activityId, activity.studentId],
      type: sequelize.QueryTypes.INSERT
    });

    console.log(`🤖 Iniciando adaptação ${adaptationId}...`);

    try {
      // Fazer query RAG para encontrar estratégias relevantes
      const queryText = `${student.nomeCompleto} ${JSON.stringify(student.diagnosticos)} ${consolidatedText.substring(0, 200)}`;
      const relevantNodes = await embeddingService.ragQuery(queryText, 5);

      console.log(`📚 Encontrados ${relevantNodes.length} nós relevantes via RAG`);

      // Chamar LLM para gerar adaptação
      const adaptationJson = await llmService.callLLM({
        perfilAluno: student,
        ocrText: consolidatedText,
        layout: ocrTexts[0]?.layout ? JSON.parse(ocrTexts[0].layout) : null,
        nos: relevantNodes
      });

      // Validar resultado
      if (!llmService.validateAdaptationJson(adaptationJson)) {
        throw new Error('JSON de adaptação inválido retornado pelo LLM');
      }

      // Gerar arquivo HTML/PDF da adaptação
      const outputDir = path.join(__dirname, '../uploads/activities/adapted');
      const filename = pdfRenderService.generateUniqueFilename(activity.studentId, activityId);
      const outputPath = path.join(outputDir, filename);

      const { htmlPath, pdfPath } = await pdfRenderService.renderAdaptationToFile(
        adaptationJson,
        outputPath
      );

      // Salvar URLs dos arquivos gerados
      const artifacts = {
        htmlPath: path.relative(path.join(__dirname, '..'), htmlPath),
        pdfPath: pdfPath ? path.relative(path.join(__dirname, '..'), pdfPath) : null
      };

      // Atualizar status para PRONTO
      await sequelize.query(`
        UPDATE activity_adaptations
        SET status = 'PRONTO',
            resultJson = $1,
            artifacts = $2,
            updatedAt = NOW()
        WHERE id = $3
      `, {
        bind: [JSON.stringify(adaptationJson), JSON.stringify(artifacts), adaptationId],
        type: sequelize.QueryTypes.UPDATE
      });

      console.log(`✅ Adaptação ${adaptationId} concluída com sucesso`);

      res.json({
        success: true,
        message: 'Adaptação gerada com sucesso',
        adaptation: {
          id: adaptationId,
          activityId,
          studentId: activity.studentId,
          status: 'PRONTO',
          artifacts,
          preview: {
            estrategias: adaptationJson.estrategias_aplicadas?.length || 0,
            itens: adaptationJson.atividade_adaptada?.itens?.length || 0
          }
        }
      });

    } catch (adaptError) {
      console.error('Erro na adaptação:', adaptError);

      // Atualizar status para FALHA
      await sequelize.query(`
        UPDATE activity_adaptations
        SET status = 'FALHA',
            error = $1,
            updatedAt = NOW()
        WHERE id = $2
      `, {
        bind: [adaptError.message, adaptationId],
        type: sequelize.QueryTypes.UPDATE
      });

      res.status(500).json({
        success: false,
        message: 'Erro na geração da adaptação',
        error: adaptError.message
      });
    }

  } catch (error) {
    console.error('Erro ao adaptar atividade:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * GET /activities/:activityId/adaptation/:adaptationId
 * Obtém status e resultado de uma adaptação
 */
router.get('/:activityId/adaptation/:adaptationId', async (req, res) => {
  try {
    const { activityId, adaptationId } = req.params;

    // Buscar adaptação com verificação de proprietário
    const [adaptation] = await sequelize.query(`
      SELECT aa.*, a.title as activityTitle, s.nomeCompleto as studentName
      FROM activity_adaptations aa
      JOIN activities a ON aa.activityId = a.id
      JOIN students s ON aa.studentId = s.id
      WHERE aa.id = $1 AND aa.activityId = $2 AND s.userId = $3
    `, {
      bind: [adaptationId, activityId, req.user.id],
      type: sequelize.QueryTypes.SELECT
    });

    if (!adaptation) {
      return res.status(404).json({
        success: false,
        message: 'Adaptação não encontrada'
      });
    }

    res.json({
      success: true,
      adaptation: {
        id: adaptation.id,
        activityId: adaptation.activityId,
        studentId: adaptation.studentId,
        status: adaptation.status,
        resultJson: adaptation.resultJson ? JSON.parse(adaptation.resultJson) : null,
        artifacts: adaptation.artifacts ? JSON.parse(adaptation.artifacts) : null,
        error: adaptation.error,
        createdAt: adaptation.createdAt,
        updatedAt: adaptation.updatedAt,
        metadata: {
          activityTitle: adaptation.activityTitle,
          studentName: adaptation.studentName
        }
      }
    });

  } catch (error) {
    console.error('Erro ao buscar adaptação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * GET /activities/:studentId
 * Lista atividades de um estudante
 */
router.get('/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

    // Verificar se estudante pertence ao usuário
    const [student] = await sequelize.query(`
      SELECT id, nomeCompleto FROM students
      WHERE id = $1 AND userId = $2
    `, {
      bind: [studentId, req.user.id],
      type: sequelize.QueryTypes.SELECT
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Estudante não encontrado'
      });
    }

    // Buscar atividades com adaptações
    const activities = await sequelize.query(`
      SELECT
        a.*,
        COUNT(ap.id) as totalPages,
        COUNT(ocr.id) as pagesWithOcr,
        COUNT(ada.id) as totalAdaptations,
        COUNT(CASE WHEN ada.status = 'PRONTO' THEN 1 END) as readyAdaptations
      FROM activities a
      LEFT JOIN activity_pages ap ON a.id = ap.activityId
      LEFT JOIN ocr_extractions ocr ON ap.id = ocr.activityPageId
      LEFT JOIN activity_adaptations ada ON a.id = ada.activityId
      WHERE a.studentId = $1
      GROUP BY a.id
      ORDER BY a.createdAt DESC
    `, {
      bind: [studentId],
      type: sequelize.QueryTypes.SELECT
    });

    res.json({
      success: true,
      student: {
        id: student.id,
        name: student.nomeCompleto
      },
      activities: activities.map(activity => ({
        id: activity.id,
        title: activity.title,
        uploadId: activity.uploadId,
        metadata: activity.metadata ? JSON.parse(activity.metadata) : {},
        stats: {
          totalPages: parseInt(activity.totalPages) || 0,
          pagesWithOcr: parseInt(activity.pagesWithOcr) || 0,
          totalAdaptations: parseInt(activity.totalAdaptations) || 0,
          readyAdaptations: parseInt(activity.readyAdaptations) || 0
        },
        createdAt: activity.createdAt,
        updatedAt: activity.updatedAt
      }))
    });

  } catch (error) {
    console.error('Erro ao listar atividades:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;