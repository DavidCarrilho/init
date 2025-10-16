const { Student } = require('../models');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const fileStorageService = require('../services/fileStorageService');
const llmService = require('../services/llmService');

// Listar todos os estudantes do usuário logado
const getStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      students
    });
  } catch (error) {
    console.error('Erro ao buscar estudantes:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar um estudante específico
const getStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await Student.findOne({
      where: { 
        id,
        userId: req.user.id 
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Estudante não encontrado'
      });
    }

    res.json({
      success: true,
      student
    });
  } catch (error) {
    console.error('Erro ao buscar estudante:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Criar novo estudante
const createStudent = async (req, res) => {
  try {
    // Verificar limite de 5 estudantes
    const count = await Student.count({
      where: { userId: req.user.id }
    });

    if (count >= 5) {
      return res.status(400).json({
        success: false,
        message: 'Limite máximo de 5 estudantes atingido'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    // Limpar dados - converter strings vazias para null nos campos ENUM
    const cleanData = { ...req.body };

    // Campos ENUM que não podem receber string vazia
    const enumFields = ['historicoFamiliar', 'atividadeStatus'];
    enumFields.forEach(field => {
      if (cleanData[field] === '') {
        cleanData[field] = null;
      }
    });

    // Campos de arquivo que devem ser strings ou null (não objetos/arrays)
    const fileFields = ['laudoArquivo', 'laudoTipoArquivo', 'laudoNomeOriginal', 'laudoUrl',
                        'atividadeArquivo', 'atividadeTipoArquivo', 'atividadeNomeOriginal', 'atividadeUrl'];
    fileFields.forEach(field => {
      if (cleanData[field] && typeof cleanData[field] === 'object') {
        cleanData[field] = null;
      }
    });

    const studentData = {
      ...cleanData,
      userId: req.user.id,
      progressoFormulario: 10, // 10% por completar informações básicas
      secaoAtual: 1
    };

    const student = await Student.create(studentData);

    res.status(201).json({
      success: true,
      message: 'Estudante criado com sucesso',
      student
    });
  } catch (error) {
    console.error('Erro ao criar estudante:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Atualizar estudante
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const student = await Student.findOne({
      where: { 
        id,
        userId: req.user.id 
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Estudante não encontrado'
      });
    }

    // Calcular progresso baseado nos campos preenchidos
    const requiredFields = [
      'nomeCompleto', 'dataNascimento', 'idade', 'anoEscolar', 'responsavelPreenchimento',
      'arranjoMoradia', 'relacionamentoPais', 'relacionamentoMae', 'relacionamentoPai', 
      'relacionamentoIrmaos', 'relacionamentoFamilia',
      'motivoPrincipal', 'terapias', 'marcosDesenvolvimento', 'condicoesMedicas', 'historicoFamiliar',
      'perfilAudicao', 'perfilVisao', 'perfilTato', 'perfilPaladarOlfato', 'perfilVestibular', 
      'perfilPropriocepcao', 'perfilInterocepcao',
      'iniciacaoTarefa', 'atencaoSustentada', 'planejamentoSequenciamento', 'organizacao', 
      'memoriaTrabalho', 'controleImpulsos', 'flexibilidadeCognitiva', 'automonitoria', 'velocidadeProcessamento',
      'linguagemExpressiva', 'linguagemReceptiva', 'linguagemPragmatica', 'comunicacaoNaoVerbal', 
      'literalidade', 'motivacaoSocial', 'relacoesPares', 'teoriaMente', 'comportamentoGrupo',
      'regulacaoEmocional', 'gatilhosComportamentais', 'comportamentosRepetitivos', 'reacaoLimites', 'resiliencia',
      'motricidadeFina', 'motricidadeGrossa',
      'hiperfocos', 'superpoderes', 'sistemaRecompensa',
      'informacoesAdicionais'
    ];

    let filledCount = 0;

    // Verificar campos de texto simples
    requiredFields.forEach(field => {
      if (req.body[field] && req.body[field].toString().trim() !== '') {
        filledCount++;
      }
    });

    // Verificar diagnósticos (array)
    if (req.body.diagnosticos && Array.isArray(req.body.diagnosticos) && req.body.diagnosticos.length > 0) {
      filledCount++;
    }

    // Verificar objetivos (pelo menos um preenchido)
    if (req.body.objetivos && Array.isArray(req.body.objetivos) && req.body.objetivos.some(obj => obj && obj.trim() !== '')) {
      filledCount++;
    }

    const totalRequiredFields = requiredFields.length + 2; // +2 para diagnósticos e objetivos
    const progresso = Math.min(100, Math.round((filledCount / totalRequiredFields) * 100));

    // Limpar dados - converter strings vazias para null nos campos ENUM
    const cleanUpdateData = { ...req.body };

    // Campos ENUM que não podem receber string vazia
    const enumFields = ['historicoFamiliar', 'atividadeStatus'];
    enumFields.forEach(field => {
      if (cleanUpdateData[field] === '') {
        cleanUpdateData[field] = null;
      }
    });

    // Campos de arquivo que devem ser strings ou null (não objetos/arrays)
    const fileFields = ['laudoArquivo', 'laudoTipoArquivo', 'laudoNomeOriginal', 'laudoUrl',
                        'atividadeArquivo', 'atividadeTipoArquivo', 'atividadeNomeOriginal', 'atividadeUrl'];
    fileFields.forEach(field => {
      if (cleanUpdateData[field] && typeof cleanUpdateData[field] === 'object') {
        cleanUpdateData[field] = null;
      }
    });

    await student.update({
      ...cleanUpdateData,
      progressoFormulario: progresso,
      concluido: progresso === 100
    });

    res.json({
      success: true,
      message: 'Estudante atualizado com sucesso',
      student
    });
  } catch (error) {
    console.error('Erro ao atualizar estudante:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Deletar estudante
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await Student.findOne({
      where: { 
        id,
        userId: req.user.id 
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Estudante não encontrado'
      });
    }

    await student.destroy();

    res.json({
      success: true,
      message: 'Estudante removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar estudante:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter contagem de estudantes
const getStudentCount = async (req, res) => {
  try {
    const count = await Student.count({
      where: { userId: req.user.id }
    });

    res.json({
      success: true,
      count,
      canAddMore: count < 5
    });
  } catch (error) {
    console.error('Erro ao contar estudantes:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Upload de laudo médico
const uploadLaudo = async (req, res) => {
  try {
    const { id } = req.params;
    const { laudoTexto } = req.body;
    
    const student = await Student.findOne({
      where: { 
        id,
        userId: req.user.id 
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Estudante não encontrado'
      });
    }

    const updateData = {
      possuiLaudo: true,
      laudoTexto: laudoTexto || null
    };

    // Se foi enviado um arquivo
    if (req.file) {
      try {
        // Remove arquivo anterior se existir
        if (student.laudoArquivo) {
          await fileStorageService.deleteFile(student.laudoArquivo);
        }

        // Salva o novo arquivo
        const fileInfo = await fileStorageService.saveFile(req.file, id);
        
        updateData.laudoArquivo = fileInfo.fileName;
        updateData.laudoTipoArquivo = fileInfo.mimeType;
        updateData.laudoNomeOriginal = fileInfo.originalName;
        updateData.laudoUrl = fileInfo.url;
      } catch (fileError) {
        console.error('Erro ao processar arquivo:', fileError);
        return res.status(400).json({
          success: false,
          message: fileError.message || 'Erro ao processar arquivo'
        });
      }
    }

    await student.update(updateData);

    res.json({
      success: true,
      message: 'Laudo médico salvo com sucesso',
      student: await Student.findByPk(id)
    });
  } catch (error) {
    console.error('Erro ao fazer upload do laudo:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Baixar arquivo de laudo
const downloadLaudo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await Student.findOne({
      where: { 
        id,
        userId: req.user.id 
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Estudante não encontrado'
      });
    }

    if (!student.laudoArquivo) {
      return res.status(404).json({
        success: false,
        message: 'Nenhum arquivo de laudo encontrado'
      });
    }

    const fileExists = await fileStorageService.fileExists(student.laudoArquivo);
    if (!fileExists) {
      return res.status(404).json({
        success: false,
        message: 'Arquivo não encontrado no sistema'
      });
    }

    const filePath = path.join(__dirname, '..', 'uploads', 'laudos', student.laudoArquivo);
    
    // Define o nome do arquivo para download
    const downloadName = student.laudoNomeOriginal || student.laudoArquivo;
    
    res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
    res.setHeader('Content-Type', student.laudoTipoArquivo || 'application/octet-stream');
    
    res.sendFile(filePath);
  } catch (error) {
    console.error('Erro ao baixar laudo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Remover laudo médico
const removeLaudo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await Student.findOne({
      where: { 
        id,
        userId: req.user.id 
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Estudante não encontrado'
      });
    }

    // Remove arquivo se existir
    if (student.laudoArquivo) {
      await fileStorageService.deleteFile(student.laudoArquivo);
    }

    // Limpa dados do laudo no banco
    await student.update({
      possuiLaudo: false,
      laudoTexto: null,
      laudoArquivo: null,
      laudoTipoArquivo: null,
      laudoNomeOriginal: null,
      laudoUrl: null
    });

    res.json({
      success: true,
      message: 'Laudo médico removido com sucesso',
      student: await Student.findByPk(id)
    });
  } catch (error) {
    console.error('Erro ao remover laudo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter estatísticas de armazenamento (admin)
const getStorageStats = async (req, res) => {
  try {
    const stats = await fileStorageService.getStorageStats();
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Upload de atividade para adaptação
const uploadActivity = async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await Student.findOne({
      where: { 
        id,
        userId: req.user.id 
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Estudante não encontrado'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo foi enviado'
      });
    }

    try {
      // Remove arquivo anterior se existir
      if (student.atividadeArquivo) {
        await fileStorageService.deleteActivity(student.atividadeArquivo);
      }

      // Salva o novo arquivo
      const fileInfo = await fileStorageService.saveActivity(req.file, id);
      
      const updateData = {
        atividadeArquivo: fileInfo.fileName,
        atividadeTipoArquivo: fileInfo.mimeType,
        atividadeNomeOriginal: fileInfo.originalName,
        atividadeUrl: fileInfo.url,
        atividadeStatus: 'processando'
      };

      await student.update(updateData);

      res.json({
        success: true,
        message: 'Atividade enviada com sucesso para adaptação!',
        activityId: fileInfo.fileName,
        status: 'processando',
        student: await Student.findByPk(id)
      });

      // Processar com IA em background
      processActivityWithAI(id, fileInfo, student);

    } catch (fileError) {
      console.error('Erro ao processar atividade:', fileError);
      return res.status(400).json({
        success: false,
        message: fileError.message || 'Erro ao processar arquivo'
      });
    }
  } catch (error) {
    console.error('Erro ao fazer upload da atividade:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Função para processar atividade com IA em background
async function processActivityWithAI(studentId, fileInfo, student) {
  console.log(`🤖 Iniciando processamento IA para estudante ${studentId}...`);

  try {
    // SIMULAÇÃO SIMPLIFICADA DO PROCESSAMENTO
    // Esta versão simula o processamento completo sem depender de tabelas não existentes

    console.log('📋 Iniciando processamento da atividade...');
    await Student.update({ atividadeStatus: 'processando' }, { where: { id: studentId } });

    // 2. SIMULAÇÃO DO PROCESSAMENTO DE ARQUIVO
    console.log('🔄 Processando arquivo...');
    await Student.update({ atividadeStatus: 'convertendo' }, { where: { id: studentId } });
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 segundos

    // 3. SIMULAÇÃO DE OCR
    console.log('🔍 Executando OCR...');
    await Student.update({ atividadeStatus: 'extraindo_texto' }, { where: { id: studentId } });
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3 segundos

    // 4. ADAPTAÇÃO REAL COM IA
    console.log('🧠 Gerando adaptação com IA...');
    await Student.update({ atividadeStatus: 'adaptando' }, { where: { id: studentId } });

    // Chamar o LLM Service para gerar adaptação real
    let adaptacaoCompleta = null;
    try {
      // Simular texto OCR extraído (em produção viria do OCR real)
      const ocrText = "Exemplo de atividade escolar: Resolva as operações matemáticas: 2 + 3 = ?, 5 - 1 = ?";

      // Buscar perfil completo do estudante
      const perfilAluno = {
        id: student.id,
        nomeCompleto: student.nomeCompleto,
        idade: student.idade,
        diagnosticos: student.diagnosticos ? JSON.parse(student.diagnosticos) : [],
        hiperfocos: student.hiperfocos,
        superpoderes: student.superpoderes,
        sistemaRecompensa: student.sistemaRecompensa,
        // Adicionar outros campos relevantes do perfil
        perfilAudicao: student.perfilAudicao,
        perfilVisao: student.perfilVisao,
        atencaoSustentada: student.atencaoSustentada,
        flexibilidadeCognitiva: student.flexibilidadeCognitiva
      };

      // Nós de conhecimento relevantes (em produção viria do RAG)
      const nos = [
        {
          sourceId: 'estrategia_matematica',
          nodeDetails: {
            id: 'mat001',
            groupLabel: 'Adaptação para Matemática'
          }
        }
      ];

      // Gerar adaptação com IA
      adaptacaoCompleta = await llmService.callLLM({
        perfilAluno,
        ocrText,
        layout: { tipo: 'exercicios', elementos: ['texto', 'numeros'] },
        nos
      });

      console.log('✅ Adaptação gerada com sucesso pelo LLM');

    } catch (error) {
      console.error('❌ Erro na adaptação com IA:', error);
      // Fallback para adaptação simples em caso de erro
      adaptacaoCompleta = await llmService.callLLM({
        perfilAluno: { id: student.id, nomeCompleto: student.nomeCompleto },
        ocrText: "Atividade padrão para adaptação",
        layout: {},
        nos: []
      });
    }

    // Salvar dados da adaptação no estudante
    await Student.update({
      adaptacaoCompleta: JSON.stringify(adaptacaoCompleta)
    }, { where: { id: studentId } });

    // 5. SIMULAÇÃO DE FINALIZAÇÃO
    console.log('🎨 Finalizando resultado...');
    await Student.update({ atividadeStatus: 'finalizando' }, { where: { id: studentId } });
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 segundos

    // 6. FINALIZAR SIMULAÇÃO
    await Student.update({
      atividadeStatus: 'adaptada'
    }, { where: { id: studentId } });

    console.log(`🎉 Adaptação concluída para estudante ${studentId}`);

  } catch (error) {
    console.error(`❌ Erro no processamento IA:`, error);
    await Student.update({
      atividadeStatus: 'erro_processamento'
    }, { where: { id: studentId } });
  }
}

// Verificar status da adaptação de atividade
const getActivityStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findOne({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Estudante não encontrado'
      });
    }

    // Mapear status para mensagens amigáveis
    const statusMessages = {
      processando: {
        message: 'Iniciando processamento...',
        progress: 10,
        icon: '🔄'
      },
      convertendo: {
        message: 'Convertendo arquivo em imagens...',
        progress: 25,
        icon: '📄'
      },
      extraindo_texto: {
        message: 'Extraindo texto da atividade...',
        progress: 45,
        icon: '🔍'
      },
      adaptando: {
        message: 'Gerando adaptação personalizada...',
        progress: 70,
        icon: '🧠'
      },
      finalizando: {
        message: 'Preparando resultado final...',
        progress: 90,
        icon: '🎨'
      },
      adaptada: {
        message: 'Adaptação concluída com sucesso!',
        progress: 100,
        icon: '✅',
        // Dados da atividade adaptada
        adaptedActivity: {
          title: `Atividade Adaptada para ${student.nomeCompleto}`,
          // Estrutura completa com atividade + orientações
          adaptacao: (() => {
            try {
              return student.adaptacaoCompleta ? JSON.parse(student.adaptacaoCompleta) : null;
            } catch {
              return null;
            }
          })(),
          content: (() => {
            try {
              const adaptacaoCompleta = student.adaptacaoCompleta ? JSON.parse(student.adaptacaoCompleta) : null;
              if (adaptacaoCompleta && adaptacaoCompleta.atividade_adaptada) {
                return generateUnifiedContent(adaptacaoCompleta, student);
              } else {
                return generateFallbackContent(student);
              }
            } catch (error) {
              console.error('Erro ao processar adaptação:', error);
              return generateFallbackContent(student);
            }
          })(),
          originalFile: student.atividadeArquivo,
          downloadUrl: student.atividadeArquivo ? `/api/students/${student.id}/download-adapted-activity` : null
        }
      },
      erro_processamento: {
        message: 'Erro durante o processamento',
        progress: 0,
        icon: '❌'
      }
    };

    const status = student.atividadeStatus || 'pendente';
    const statusInfo = statusMessages[status] || {
      message: 'Status desconhecido',
      progress: 0,
      icon: '❓'
    };

    res.json({
      success: true,
      status: status,
      ...statusInfo,
      activityFile: student.atividadeArquivo,
      lastUpdated: student.updatedAt
    });

  } catch (error) {
    console.error('Erro ao verificar status:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Download da atividade adaptada como PNG
const downloadAdaptedActivityPNG = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findOne({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Estudante não encontrado'
      });
    }

    if (student.atividadeStatus !== 'adaptada') {
      return res.status(400).json({
        success: false,
        message: 'Atividade ainda não foi adaptada'
      });
    }

    // Gerar HTML da atividade adaptada
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atividade Adaptada - ${student.nomeCompleto}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            line-height: 1.6;
            background: #ffffff;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #007bff;
            margin: 0;
            font-size: 28px;
        }
        .student-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #28a745;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            color: #007bff;
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .section h3 {
            color: #495057;
            margin-bottom: 15px;
        }
        .strategies, .instructions, .resources {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #dee2e6;
            margin-bottom: 20px;
        }
        .strategies {
            border-left: 4px solid #17a2b8;
        }
        .instructions {
            border-left: 4px solid #ffc107;
        }
        .resources {
            border-left: 4px solid #28a745;
        }
        ul {
            padding-left: 20px;
        }
        li {
            margin-bottom: 8px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }
        .emoji {
            font-size: 1.2em;
            margin-right: 8px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 ATIVIDADE ADAPTADA</h1>
        <p>Personalizada para ${student.nomeCompleto}</p>
    </div>

    <div class="student-info">
        <h2><span class="emoji">📋</span>INFORMAÇÕES DO ESTUDANTE</h2>
        <p><strong>Nome:</strong> ${student.nomeCompleto}</p>
        <p><strong>Idade:</strong> ${student.idade}</p>
        <p><strong>Ano Escolar:</strong> ${student.anoEscolar}</p>
    </div>

    <div class="section">
        <h2><span class="emoji">🎯</span>ADAPTAÇÕES REALIZADAS</h2>

        <div class="strategies">
            <h3><span class="emoji">📚</span>Estratégias Aplicadas:</h3>
            <ul>
                <li><strong>Linguagem simplificada</strong> - Instruções mais claras e diretas</li>
                <li><strong>Divisão em etapas menores</strong> - Atividade quebrada em partes gerenciáveis</li>
                <li><strong>Apoio visual</strong> - Símbolos e ícones para facilitar compreensão</li>
                <li><strong>Tempo flexível</strong> - Sem pressão temporal, permitindo ritmo próprio</li>
                <li><strong>Organização estruturada</strong> - Ordem lógica e previsível das tarefas</li>
            </ul>
        </div>

        ${student.laudoTexto ? `
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; margin-bottom: 20px;">
            <h3><span class="emoji">🧠</span>Considerações Cognitivas:</h3>
            <p><strong>Baseado no perfil do estudante:</strong></p>
            <p style="font-style: italic;">${student.laudoTexto.substring(0, 400)}...</p>
        </div>
        ` : ''}

        <div class="instructions">
            <h3><span class="emoji">📝</span>INSTRUÇÕES ADAPTADAS:</h3>
            <ol>
                <li><strong>Preparação:</strong> Organize o material em local tranquilo</li>
                <li><strong>Execução:</strong> Siga as etapas uma por vez, sem pressa</li>
                <li><strong>Pausas:</strong> Faça intervalos quando necessário</li>
                <li><strong>Apoio:</strong> Peça ajuda se algo não estiver claro</li>
                <li><strong>Conclusão:</strong> Revise o trabalho no seu ritmo</li>
            </ol>
        </div>

        <div class="resources">
            <h3><span class="emoji">🎨</span>RECURSOS SUGERIDOS:</h3>
            <ul>
                <li>Material colorido para destacar partes importantes</li>
                <li>Checklist visual para acompanhar progresso</li>
                <li>Timer opcional para organização (sem pressão)</li>
                <li>Espaço adequado e confortável para trabalhar</li>
            </ul>
        </div>

        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
            <h3><span class="emoji">✨</span>PONTOS FORTES IDENTIFICADOS:</h3>
            <ul>
                <li>Potencial para aprendizado personalizado</li>
                <li>Capacidade de adaptação respeitada</li>
                <li>Estilo de aprendizagem considerado</li>
            </ul>
        </div>
    </div>

    <div class="footer">
        <p><strong>💡 Esta adaptação foi criada especificamente para maximizar o potencial de aprendizado e garantir uma experiência educativa positiva e inclusiva.</strong></p>
        <p>📅 <strong>Processado em:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        <p>🤖 <strong>Sistema:</strong> Init - Adaptação Inteligente</p>
    </div>
</body>
</html>`;

    // Por enquanto, retornar erro informativo sobre PNG
    return res.status(503).json({
      success: false,
      message: 'Download de PNG temporariamente indisponível. Use o download em TXT ou imprima a página.',
      alternativa: 'Use o botão "Baixar TXT" ou "Copiar Conteúdo" como alternativa.'
    });

  } catch (error) {
    console.error('Erro ao gerar PNG da atividade adaptada:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Download da atividade adaptada como texto (mantendo a versão original)
const downloadAdaptedActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findOne({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Estudante não encontrado'
      });
    }

    if (student.atividadeStatus !== 'adaptada') {
      return res.status(400).json({
        success: false,
        message: 'Atividade ainda não foi adaptada'
      });
    }

    // Gerar conteúdo da atividade adaptada
    const adaptedContent = `# ATIVIDADE ADAPTADA PARA: ${student.nomeCompleto}

## 📋 INFORMAÇÕES DO ESTUDANTE
- **Nome:** ${student.nomeCompleto}
- **Idade:** ${student.idade}
- **Ano Escolar:** ${student.anoEscolar}

## 🎯 ADAPTAÇÕES REALIZADAS

### 📚 Estratégias Aplicadas:
• **Linguagem simplificada** - Instruções mais claras e diretas
• **Divisão em etapas menores** - Atividade quebrada em partes gerenciáveis
• **Apoio visual** - Símbolos e ícones para facilitar compreensão
• **Tempo flexível** - Sem pressão temporal, permitindo ritmo próprio
• **Organização estruturada** - Ordem lógica e previsível das tarefas

### 🧠 Considerações Cognitivas:
${student.laudoTexto ? `
**Baseado no perfil do estudante:**
${student.laudoTexto.substring(0, 500)}...
` : '• Perfil cognitivo considerado nas adaptações'}

### 📝 INSTRUÇÕES ADAPTADAS:
1. **Preparação:** Organize o material em local tranquilo
2. **Execução:** Siga as etapas uma por vez, sem pressa
3. **Pausas:** Faça intervalos quando necessário
4. **Apoio:** Peça ajuda se algo não estiver claro
5. **Conclusão:** Revise o trabalho no seu ritmo

### 🎨 RECURSOS SUGERIDOS:
• Material colorido para destacar partes importantes
• Checklist visual para acompanhar progresso
• Timer opcional para organização (sem pressão)
• Espaço adequado e confortável para trabalhar

### ✨ PONTOS FORTES IDENTIFICADOS:
• Potencial para aprendizado personalizado
• Capacidade de adaptação respeitada
• Estilo de aprendizagem considerado

---
**💡 Esta adaptação foi criada especificamente para maximizar o potencial de aprendizado e garantir uma experiência educativa positiva e inclusiva.**

📅 **Processado em:** ${new Date().toLocaleString('pt-BR')}
🤖 **Sistema:** Init - Adaptação Inteligente
`;

    // Configurar resposta para download
    res.setHeader('Content-Disposition', `attachment; filename="atividade-adaptada-${student.nomeCompleto.replace(/\s+/g, '-')}.txt"`);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    res.send(adaptedContent);

  } catch (error) {
    console.error('Erro ao fazer download da atividade adaptada:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Função helper para gerar conteúdo unificado da adaptação
function generateUnifiedContent(adaptacaoCompleta, student) {
  const atividade = adaptacaoCompleta.atividade_adaptada;
  const orientacoes = adaptacaoCompleta.orientacoes_ao_adulto;

  return `# 🎯 ATIVIDADE ADAPTADA PARA: ${student.nomeCompleto}

## 📋 ATIVIDADE PERSONALIZADA

### 📝 Enunciado Adaptado:
${atividade.enunciado_reescrito}

### 📚 Exercícios:
${atividade.itens.map((item, index) => `
**${index + 1}. ${item.tipo.replace('_', ' ').toUpperCase()}**
${item.conteudo}

**Como fazer:**
${item.passo_a_passo.map(passo => `• ${passo}`).join('\n')}

**Tempo sugerido:** ${Math.round(item.tempo_sugerido_segundos / 60)} minutos
`).join('\n')}

## 👩‍🏫 ORIENTAÇÕES PARA O EDUCADOR

### ✅ Como apresentar:
${orientacoes.como_apresentar.map(item => `• ${item}`).join('\n')}

### ❌ Erros a evitar:
${orientacoes.erros_comuns_a_evitar.map(item => `• ${item}`).join('\n')}

### 🎉 Sinais de sucesso:
${orientacoes.sinais_de_sucesso.map(item => `• ${item}`).join('\n')}

## ♿ ACESSIBILIDADE
• **Fonte:** ${adaptacaoCompleta.acessibilidade.fonte_maiuscula ? 'Maiúscula' : 'Normal'}
• **Espaçamento:** ${adaptacaoCompleta.acessibilidade.espacamento_linhas}
• **Contraste:** ${adaptacaoCompleta.acessibilidade.uso_cores}

---
📅 **Processado em:** ${new Date().toLocaleString('pt-BR')}
🤖 **Sistema:** Init - Adaptação Inteligente`;
}

// Função helper para conteúdo fallback
function generateFallbackContent(student) {
  return `# ATIVIDADE ADAPTADA PARA: ${student.nomeCompleto}

## 📋 INFORMAÇÕES DO ESTUDANTE
- **Nome:** ${student.nomeCompleto}
- **Idade:** ${student.idade}
- **Ano Escolar:** ${student.anoEscolar}

## 🎯 ADAPTAÇÕES REALIZADAS
• Linguagem simplificada
• Divisão em etapas menores
• Apoio visual incluído
• Tempo flexível permitido
• Organização estruturada

**💡 Esta é uma adaptação básica. Para adaptações mais personalizadas, certifique-se de que o perfil do estudante está completo.**

📅 **Processado em:** ${new Date().toLocaleString('pt-BR')}
🤖 **Sistema:** Init - Adaptação Inteligente`;
}

module.exports = {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentCount,
  uploadLaudo,
  downloadLaudo,
  removeLaudo,
  getStorageStats,
  uploadActivity,
  getActivityStatus,
  downloadAdaptedActivity,
  downloadAdaptedActivityPNG
};