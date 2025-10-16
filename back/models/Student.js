const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  // Seção 1: Informações Gerais
  nomeCompleto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dataNascimento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  idade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  anoEscolar: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  responsavelPreenchimento: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
  // Seção 2: Contexto Familiar e Social
  arranjoMoradia: {
    type: DataTypes.TEXT,
  },
  relacionamentoPais: {
    type: DataTypes.TEXT,
  },
  relacionamentoMae: {
    type: DataTypes.TEXT,
  },
  relacionamentoPai: {
    type: DataTypes.TEXT,
  },
  relacionamentoIrmaos: {
    type: DataTypes.TEXT,
  },
  relacionamentoFamilia: {
    type: DataTypes.TEXT,
  },
  
  // Seção 3: Histórico de Saúde
  motivoPrincipal: {
    type: DataTypes.TEXT,
  },
  diagnosticos: {
    type: DataTypes.JSON, // Array de diagnósticos
  },
  terapias: {
    type: DataTypes.TEXT,
  },
  marcosDesenvolvimento: {
    type: DataTypes.TEXT,
  },
  condicoesMedicas: {
    type: DataTypes.TEXT,
  },
  historicoFamiliar: {
    type: DataTypes.ENUM('sim', 'nao', 'nao_sei'),
  },
  
  // Seção 4: Perfil Sensorial
  perfilAudicao: {
    type: DataTypes.TEXT,
  },
  perfilVisao: {
    type: DataTypes.TEXT,
  },
  perfilTato: {
    type: DataTypes.TEXT,
  },
  perfilPaladarOlfato: {
    type: DataTypes.TEXT,
  },
  perfilVestibular: {
    type: DataTypes.TEXT,
  },
  perfilPropriocepcao: {
    type: DataTypes.TEXT,
  },
  perfilInterocepcao: {
    type: DataTypes.TEXT,
  },
  
  // Seção 5: Funções Executivas
  iniciacaoTarefa: {
    type: DataTypes.TEXT,
  },
  atencaoSustentada: {
    type: DataTypes.TEXT,
  },
  planejamentoSequenciamento: {
    type: DataTypes.TEXT,
  },
  organizacao: {
    type: DataTypes.TEXT,
  },
  memoriaTrabalho: {
    type: DataTypes.TEXT,
  },
  controleImpulsos: {
    type: DataTypes.TEXT,
  },
  flexibilidadeCognitiva: {
    type: DataTypes.TEXT,
  },
  automonitoria: {
    type: DataTypes.TEXT,
  },
  velocidadeProcessamento: {
    type: DataTypes.TEXT,
  },
  
  // Seção 6: Comunicação e Socialização
  linguagemExpressiva: {
    type: DataTypes.TEXT,
  },
  linguagemReceptiva: {
    type: DataTypes.TEXT,
  },
  linguagemPragmatica: {
    type: DataTypes.TEXT,
  },
  comunicacaoNaoVerbal: {
    type: DataTypes.TEXT,
  },
  literalidade: {
    type: DataTypes.TEXT,
  },
  motivacaoSocial: {
    type: DataTypes.TEXT,
  },
  relacoesPares: {
    type: DataTypes.TEXT,
  },
  teoriaMente: {
    type: DataTypes.TEXT,
  },
  comportamentoGrupo: {
    type: DataTypes.TEXT,
  },
  
  // Seção 7: Perfil Comportamental
  regulacaoEmocional: {
    type: DataTypes.TEXT,
  },
  gatilhosComportamentais: {
    type: DataTypes.TEXT,
  },
  comportamentosRepetitivos: {
    type: DataTypes.TEXT,
  },
  reacaoLimites: {
    type: DataTypes.TEXT,
  },
  resiliencia: {
    type: DataTypes.TEXT,
  },
  
  // Seção 8: Habilidades Motoras
  motricidadeFina: {
    type: DataTypes.TEXT,
  },
  motricidadeGrossa: {
    type: DataTypes.TEXT,
  },
  
  // Seção 9: Pontos Fortes
  hiperfocos: {
    type: DataTypes.TEXT,
  },
  superpoderes: {
    type: DataTypes.TEXT,
  },
  sistemaRecompensa: {
    type: DataTypes.TEXT,
  },
  
  // Seção 10: Objetivos
  objetivos: {
    type: DataTypes.JSON, // Array de 3 objetivos
  },
  informacoesAdicionais: {
    type: DataTypes.TEXT,
  },
  
  // Laudo Médico (Opcional)
  possuiLaudo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  laudoTexto: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  laudoArquivo: {
    type: DataTypes.STRING, // Caminho para o arquivo
    allowNull: true,
  },
  laudoTipoArquivo: {
    type: DataTypes.STRING, // pdf, jpg, png, etc
    allowNull: true,
  },
  laudoNomeOriginal: {
    type: DataTypes.STRING, // Nome original do arquivo
    allowNull: true,
  },
  laudoUrl: {
    type: DataTypes.STRING, // URL para acessar o arquivo
    allowNull: true,
  },
  
  // Campos de Atividade para Adaptação
  atividadeArquivo: {
    type: DataTypes.STRING, // Nome do arquivo de atividade
    allowNull: true,
  },
  atividadeTipoArquivo: {
    type: DataTypes.STRING, // MIME type do arquivo
    allowNull: true,
  },
  atividadeNomeOriginal: {
    type: DataTypes.STRING, // Nome original do arquivo
    allowNull: true,
  },
  atividadeUrl: {
    type: DataTypes.STRING, // URL para acessar o arquivo
    allowNull: true,
  },
  atividadeStatus: {
    type: DataTypes.ENUM('pendente', 'processando', 'convertendo', 'extraindo_texto', 'adaptando', 'finalizando', 'adaptada', 'erro', 'erro_processamento'),
    defaultValue: 'pendente',
    allowNull: true,
  },
  adaptacaoCompleta: {
    type: DataTypes.TEXT, // JSON da adaptação completa gerada pela IA
    allowNull: true,
  },
  
  // Metadados
  progressoFormulario: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Porcentagem de conclusão (0-100)
  },
  secaoAtual: {
    type: DataTypes.INTEGER,
    defaultValue: 1, // Seção atual (1-10)
  },
  concluido: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'students',
  timestamps: true,
});

module.exports = Student;