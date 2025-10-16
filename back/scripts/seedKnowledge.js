/**
 * Script para popular a base de conhecimento com estratégias pedagógicas
 * Execução: node scripts/seedKnowledge.js
 */

const { sequelize } = require('../config/database');
const embeddingService = require('../services/embeddingService');

// Base de conhecimento expandida com estratégias para todas as neurodivergências
const KNOWLEDGE_BASE = [
  {
    id: "fragmentacao-tarefas",
    groupLabel: "Fragmentação de Tarefas",
    targetConditions: ["TEA", "TDAH", "Deficiência Intelectual"],
    signals: [
      "dificuldade em completar atividades longas",
      "abandono frequente de tarefas",
      "sobrecarga cognitiva visível",
      "ansiedade diante de instruções complexas"
    ],
    strategy: {
      name: "Dividir atividades complexas em etapas menores e sequenciais",
      implementation: [
        "Quebrar a atividade em 3-5 passos máximo",
        "Apresentar apenas um passo por vez",
        "Usar checkpoints visuais para progresso",
        "Celebrar cada etapa concluída"
      ],
      materials: ["cartões com etapas", "cronômetro visual", "checklist ilustrado"]
    },
    foundation: {
      theory: "Teoria da Carga Cognitiva (Sweller)",
      evidence: "Reduz sobrecarga da memória de trabalho em até 40%",
      studies: ["Chandler & Sweller (1991)", "Paas & van Merriënboer (1994)"]
    },
    examples: [
      "Matemática: '1) Leia o problema 2) Identifique os números 3) Escolha a operação 4) Calcule'",
      "Produção textual: '1) Escolha o tema 2) Faça lista de ideias 3) Organize em parágrafos 4) Escreva'",
      "Ciências: '1) Observe a figura 2) Leia a pergunta 3) Procure pistas na imagem 4) Responda'"
    ],
    contraindications: [
      "Atividades que requerem visão holística",
      "Estudantes com alto nível de autonomia",
      "Tarefas já muito simples"
    ],
    tags: ["cognitivo", "estruturacao", "autonomia"],
    lastUpdated: "2024-01-15"
  },

  {
    id: "apoios-visuais",
    groupLabel: "Apoios Visuais e Pictogramas",
    targetConditions: ["TEA", "Dislexia", "Deficiência Auditiva", "Deficiência Intelectual"],
    signals: [
      "melhor compreensão com imagens",
      "dificuldade com texto puro",
      "interesse por elementos visuais",
      "processamento visual superior ao verbal"
    ],
    strategy: {
      name: "Incorporar elementos visuais para facilitar compreensão",
      implementation: [
        "Adicionar pictogramas nas instruções principais",
        "Usar ícones para operações matemáticas",
        "Criar mapas visuais de conceitos",
        "Incluir exemplos ilustrados"
      ],
      materials: ["biblioteca de pictogramas", "ícones pedagógicos", "esquemas visuais"]
    },
    foundation: {
      theory: "Teoria do Duplo Código (Paivio)",
      evidence: "Melhora retenção em 65% quando combinado texto + imagem",
      studies: ["Paivio (1986)", "Mayer (2009)", "Clark & Lyons (2004)"]
    },
    examples: [
      "Instruções: 'Leia 👁️ + Pense 🤔 + Escreva ✏️'",
      "Matemática: usar símbolos visuais para operações (+, -, ×, ÷)",
      "Português: ícones para substantivo 🏠, verbo 🏃, adjetivo 🌈"
    ],
    contraindications: [
      "Estudantes com deficiência visual severa",
      "Sobrecarga visual (mais de 7 elementos)",
      "Atividades de alta abstração"
    ],
    tags: ["visual", "comunicacao", "compreensao"],
    lastUpdated: "2024-01-15"
  },

  {
    id: "tempo-estendido",
    groupLabel: "Tempo Estendido e Flexível",
    targetConditions: ["TEA", "TDAH", "Dislexia", "Discalculia", "Deficiência Intelectual"],
    signals: [
      "necessita mais tempo que os pares",
      "ansiedade com prazos rígidos",
      "qualidade do trabalho melhora com tempo extra",
      "processamento mais lento mas correto"
    ],
    strategy: {
      name: "Conceder tempo adicional e pausas estratégicas",
      implementation: [
        "Aumentar tempo em 50-100% do padrão",
        "Permitir pausas de 2-3 minutos a cada 15min",
        "Usar cronômetros visuais não-estressantes",
        "Focar na qualidade, não velocidade"
      ],
      materials: ["timer visual", "relógio adaptado", "sinais de pausa"]
    },
    foundation: {
      theory: "Processamento da Informação (Sternberg)",
      evidence: "Melhora performance em 30-45% com tempo adequado",
      studies: ["Fuchs et al. (2000)", "Elliott et al. (2010)"]
    },
    examples: [
      "Prova de 60min → 90-120min",
      "Leitura: permitir releitura sem penalização",
      "Cálculos: tempo extra para verificação"
    ],
    contraindications: [
      "Avaliações com limite temporal essencial",
      "Atividades em grupo com timing fixo",
      "Estudantes que se beneficiam de pressão temporal"
    ],
    tags: ["tempo", "ansiedade", "performance"],
    lastUpdated: "2024-01-15"
  },

  {
    id: "reducao-estimulos",
    groupLabel: "Redução de Estímulos Distratores",
    targetConditions: ["TEA", "TDAH", "Hipersensibilidade Sensorial"],
    signals: [
      "facilmente distraído por ruídos/cores/movimentos",
      "melhor foco em ambientes calmos",
      "sobrecarga sensorial aparente",
      "autorregulação sensorial (tampar ouvidos, etc.)"
    ],
    strategy: {
      name: "Minimizar distrações visuais e auditivas no material",
      implementation: [
        "Usar fundo branco ou cores neutras",
        "Limitar a 3-4 elementos por página",
        "Eliminar decorações desnecessárias",
        "Fonte simples e tamanho adequado"
      ],
      materials: ["templates limpos", "fontes sem serif", "cores neutras"]
    },
    foundation: {
      theory: "Processamento Sensorial (Ayres)",
      evidence: "Reduz distrações em 55% em estudantes com TEA/TDAH",
      studies: ["Grandin & Panek (2013)", "Dunn (2007)"]
    },
    examples: [
      "Layout limpo: muito espaço em branco",
      "Cores: preto no branco, azul escuro",
      "Fontes: Arial, Calibri, tamanho 14+"
    ],
    contraindications: [
      "Estudantes que se beneficiam de estímulos visuais",
      "Atividades que requerem elementos decorativos",
      "Materiais artísticos/criativos"
    ],
    tags: ["sensorial", "atencao", "foco"],
    lastUpdated: "2024-01-15"
  },

  {
    id: "linguagem-concreta",
    groupLabel: "Linguagem Concreta e Direta",
    targetConditions: ["TEA", "Deficiência Intelectual", "Dislexia"],
    signals: [
      "dificuldade com linguagem figurada",
      "interpretação literal de instruções",
      "melhor compreensão com exemplos concretos",
      "confusão com termos abstratos"
    ],
    strategy: {
      name: "Usar vocabulário simples, frases curtas e exemplos concretos",
      implementation: [
        "Máximo 15 palavras por frase",
        "Evitar metáforas e expressões idiomáticas",
        "Usar verbos no imperativo (faça, complete, marque)",
        "Incluir exemplos práticos"
      ],
      materials: ["dicionário simplificado", "banco de sinônimos simples"]
    },
    foundation: {
      theory: "Teoria da Mente e Pragmática",
      evidence: "Melhora compreensão em 70% com linguagem direta",
      studies: ["Baron-Cohen (1995)", "Happé & Frith (2014)"]
    },
    examples: [
      "Em vez de 'Analise criticamente' → 'Leia e diga o que está certo ou errado'",
      "Em vez de 'Contextualize' → 'Explique quando isso acontece'",
      "Em vez de 'Interprete' → 'Diga o que isso significa'"
    ],
    contraindications: [
      "Atividades de interpretação literária avançada",
      "Desenvolvimento de linguagem figurada",
      "Estudantes com alto nível linguístico"
    ],
    tags: ["linguagem", "compreensao", "clareza"],
    lastUpdated: "2024-01-15"
  },

  {
    id: "multiplas-representacoes",
    groupLabel: "Múltiplas Representações",
    targetConditions: ["Dislexia", "Discalculia", "TDAH", "Estilos de Aprendizagem Diversos"],
    signals: [
      "aprende melhor com diferentes modalidades",
      "dificuldade com apenas uma forma de apresentação",
      "interesse quando informação é variada",
      "compreensão parcial com método único"
    ],
    strategy: {
      name: "Apresentar informações em formatos múltiplos (visual, auditivo, tátil)",
      implementation: [
        "Combinar texto + imagem + áudio quando possível",
        "Usar gráficos, tabelas E descrições verbais",
        "Incluir atividades manipulativas",
        "Oferecer escolha de modalidade de resposta"
      ],
      materials: ["recursos multimodais", "ferramentas de áudio", "manipulativos"]
    },
    foundation: {
      theory: "Teoria das Inteligências Múltiplas (Gardner)",
      evidence: "Aumenta retenção em 42% com múltiplas modalidades",
      studies: ["Gardner (1983)", "Rose & Meyer (2002)"]
    },
    examples: [
      "Matemática: números + desenhos + objetos físicos",
      "História: texto + linha do tempo + imagens + áudio",
      "Ciências: experimento + explicação + diagrama"
    ],
    contraindications: [
      "Sobrecarga cognitiva (muitas modalidades simultâneas)",
      "Estudantes com déficit atencional severo",
      "Limitações de tempo extremas"
    ],
    tags: ["multimodal", "estilos", "representacao"],
    lastUpdated: "2024-01-15"
  },

  {
    id: "feedback-imediato",
    groupLabel: "Feedback Imediato e Específico",
    targetConditions: ["TDAH", "Ansiedade", "Baixa Autoestima", "TEA"],
    signals: [
      "necessita confirmação frequente",
      "ansiedade sobre desempenho",
      "motivação aumenta com reconhecimento",
      "aprende melhor com correção imediata"
    ],
    strategy: {
      name: "Fornecer retorno específico e imediato sobre o desempenho",
      implementation: [
        "Dar feedback a cada 2-3 questões",
        "Usar reforços positivos específicos",
        "Mostrar progresso visualmente",
        "Corrigir erros imediatamente com explicação"
      ],
      materials: ["sistema de pontos", "gráficos de progresso", "adesivos/stamps"]
    },
    foundation: {
      theory: "Teoria do Reforço (Skinner)",
      evidence: "Melhora engajamento em 60% com feedback imediato",
      studies: ["Skinner (1958)", "Hattie & Timperley (2007)"]
    },
    examples: [
      "✓ 'Excelente! Você identificou corretamente o sujeito da frase'",
      "? 'Quase! Tente pensar: qual número é maior?'",
      "→ Mostrar barra de progresso: 3/10 questões"
    ],
    contraindications: [
      "Estudantes que preferem trabalhar independentemente",
      "Avaliações formais/padronizadas",
      "Atividades de reflexão prolongada"
    ],
    tags: ["feedback", "motivacao", "engajamento"],
    lastUpdated: "2024-01-15"
  },

  {
    id: "organizacao-espacial",
    groupLabel: "Organização Espacial Clara",
    targetConditions: ["Dislexia", "Dispraxia", "TEA", "Déficits Visuoespaciais"],
    signals: [
      "dificuldade para localizar informações na página",
      "perde-se em layouts complexos",
      "melhor desempenho com organização clara",
      "evita materiais desorganizados"
    ],
    strategy: {
      name: "Estruturar informações com hierarquia visual clara",
      implementation: [
        "Usar boxes/molduras para separar seções",
        "Alinhar elementos consistentemente",
        "Criar fluxo de leitura óbvio (Z ou F)",
        "Numerar seções claramente"
      ],
      materials: ["templates estruturados", "réguas/guias", "marcadores visuais"]
    },
    foundation: {
      theory: "Gestalt e Percepção Visual",
      evidence: "Melhora localização de informação em 50%",
      studies: ["Ware (2012)", "Few (2009)"]
    },
    examples: [
      "Seções numeradas em boxes separados",
      "Instruções sempre no topo, exercícios abaixo",
      "Usar bordas para delimitar áreas"
    ],
    contraindications: [
      "Atividades que requerem layout livre",
      "Materiais artísticos/criativos",
      "Estudantes com preferência por layouts dinâmicos"
    ],
    tags: ["organizacao", "visual", "estrutura"],
    lastUpdated: "2024-01-15"
  },

  // ESTRATÉGIAS ESPECÍFICAS PARA DISLEXIA
  {
    id: "fonemas-visuais",
    groupLabel: "Apoio Fonético-Visual",
    targetConditions: ["Dislexia", "Dificuldades de Leitura"],
    signals: [
      "confusão entre letras similares (b/d, p/q)",
      "dificuldade em decodificar palavras",
      "leitura lenta ou com omissões",
      "troca de fonemas ao ler"
    ],
    strategy: {
      name: "Combinar apoios visuais com decomposição fonética",
      implementation: [
        "Destacar sílabas com cores diferentes",
        "Usar símbolos visuais para fonemas complexos",
        "Aplicar técnica de janela deslizante",
        "Incluir áudio quando possível"
      ],
      materials: ["marcadores coloridos", "régua de leitura", "cards fonéticos"]
    },
    foundation: {
      theory: "Modelo de Dupla Rota (Coltheart)",
      evidence: "Melhora velocidade de leitura em 35%",
      studies: ["Snowling (2000)", "Shaywitz (2003)"]
    },
    examples: [
      "Palavras complexas divididas: 'cons-ti-tui-ção'",
      "Destaque visual em encontros consonantais: 'pr', 'bl', 'tr'",
      "Uso de cores: consoantes azuis, vogais vermelhas"
    ],
    tags: ["dislexia", "leitura", "fonética"]
  },

  // ESTRATÉGIAS PARA DISCALCULIA
  {
    id: "manipulativos-concretos",
    groupLabel: "Matemática com Materiais Concretos",
    targetConditions: ["Discalculia", "Dificuldades Matemáticas"],
    signals: [
      "dificuldade com conceitos numéricos abstratos",
      "confusão entre operações matemáticas",
      "problemas com sequências numéricas",
      "dificuldade em estimar quantidades"
    ],
    strategy: {
      name: "Utilizar materiais manipulativos e representações visuais",
      implementation: [
        "Começar sempre com objetos concretos",
        "Progredir para representações pictóricas",
        "Só então introduzir símbolos abstratos",
        "Manter conexão visual-numérica"
      ],
      materials: ["blocos lógicos", "ábaco", "material dourado", "fichas"]
    },
    foundation: {
      theory: "CPA - Concreto, Pictórico, Abstrato (Bruner)",
      evidence: "Aumenta compreensão matemática em 45%",
      studies: ["Butterworth (2005)", "Wilson (2008)"]
    },
    examples: [
      "Adição com blocos antes de números",
      "Gráficos visuais para frações",
      "Régua numérica física para subtração"
    ],
    tags: ["discalculia", "matematica", "concreto"]
  },

  // ESTRATÉGIAS PARA TRANSTORNO DO PROCESSAMENTO AUDITIVO
  {
    id: "redundancia-multimodal",
    groupLabel: "Redundância de Informações",
    targetConditions: ["TPA", "Deficiência Auditiva", "Dificuldades de Processamento"],
    signals: [
      "não segue instruções verbais complexas",
      "pede repetição frequente",
      "confunde sons similares",
      "distrai-se com ruídos de fundo"
    ],
    strategy: {
      name: "Apresentar informações em múltiplas modalidades simultaneamente",
      implementation: [
        "Combinar fala com texto escrito",
        "Usar gestos e demonstrações visuais",
        "Fornecer resumos escritos",
        "Reduzir ruído ambiente"
      ],
      materials: ["cartões visuais", "fones de ouvido", "ambiente silencioso"]
    },
    foundation: {
      theory: "Teoria do Processamento de Informação Multimodal",
      evidence: "Melhora compreensão em 60% dos casos",
      studies: ["Bellis (2003)", "Chermak & Musiek (2007)"]
    },
    examples: [
      "Instruções faladas + escritas + demonstradas",
      "Legendas em vídeos educativos",
      "Esquemas visuais de conceitos falados"
    ],
    tags: ["auditivo", "multimodal", "processamento"]
  },

  // ESTRATÉGIAS PARA SÍNDROME DE ASPERGER/TEA NÍVEL 1
  {
    id: "rotinas-previsibilidade",
    groupLabel: "Estruturas Previsíveis e Rotinas",
    targetConditions: ["TEA", "Asperger", "Ansiedade"],
    signals: [
      "ansiedade com mudanças imprevistas",
      "necessita de instruções muito específicas",
      "dificuldade com ambiguidades",
      "foco intenso em detalhes"
    ],
    strategy: {
      name: "Criar estruturas altamente previsíveis com instruções explícitas",
      implementation: [
        "Usar sempre o mesmo formato de atividades",
        "Incluir instruções passo-a-passo detalhadas",
        "Avisar sobre mudanças com antecedência",
        "Criar rotinas de início e fim"
      ],
      materials: ["templates fixos", "cronograma visual", "cartões de rotina"]
    },
    foundation: {
      theory: "Teoria da Coerência Central Fraca (Frith)",
      evidence: "Reduz ansiedade e melhora desempenho em 50%",
      studies: ["Baron-Cohen (2008)", "Wing (1997)"]
    },
    examples: [
      "Mesma sequência: título → instruções → exemplo → exercício",
      "Avisos: 'Em 5 minutos vamos mudar de atividade'",
      "Rituais: sempre começar organizando materiais"
    ],
    tags: ["tea", "rotina", "previsibilidade"]
  },

  // ESTRATÉGIAS PARA DEFICIÊNCIA INTELECTUAL
  {
    id: "aprendizagem-significativa",
    groupLabel: "Aprendizagem Contextualizada e Funcional",
    targetConditions: ["Deficiência Intelectual", "Síndrome de Down"],
    signals: [
      "dificuldade em generalizar aprendizados",
      "necessita de muitas repetições",
      "aprende melhor com exemplos concretos",
      "motivação através de atividades práticas"
    ],
    strategy: {
      name: "Conectar aprendizados a situações reais e funcionais",
      implementation: [
        "Usar exemplos da vida cotidiana",
        "Repetir em contextos diferentes",
        "Conectar com interesses pessoais",
        "Dividir em micro-objetivos"
      ],
      materials: ["objetos reais", "fotos contextualizadas", "situações práticas"]
    },
    foundation: {
      theory: "Aprendizagem Significativa (Ausubel)",
      evidence: "Melhora retenção em 70% quando contextualizado",
      studies: ["Beirne-Smith et al. (2006)", "Drew & Hardman (2007)"]
    },
    examples: [
      "Matemática: contar dinheiro real para compras",
      "Português: ler receitas culinárias simples",
      "Geografia: usar mapas da própria cidade"
    ],
    tags: ["deficiencia-intelectual", "funcional", "contexto"]
  },

  // ESTRATÉGIAS PARA TRANSTORNO BIPOLAR/ALTERAÇÕES DE HUMOR
  {
    id: "regulacao-emocional",
    groupLabel: "Apoio à Autorregulação Emocional",
    targetConditions: ["Transtorno Bipolar", "Alterações de Humor", "Ansiedade"],
    signals: [
      "oscilações bruscas de humor durante atividades",
      "dificuldade em manter concentração",
      "frustra-se facilmente com desafios",
      "necessita pausas frequentes"
    ],
    strategy: {
      name: "Integrar estratégias de autorregulação emocional",
      implementation: [
        "Incluir check-ins emocionais regulares",
        "Permitir pausas quando necessário",
        "Usar escalas visuais de humor",
        "Adaptar dificuldade ao estado emocional"
      ],
      materials: ["termômetro emocional", "cartões de pausa", "atividades calmantes"]
    },
    foundation: {
      theory: "Teoria da Autorregulação Emocional (Gross)",
      evidence: "Melhora engajamento acadêmico em 40%",
      studies: ["Mowbray et al. (2006)", "Faraone et al. (2010)"]
    },
    examples: [
      "Escala 1-5: 'Como você está se sentindo agora?'",
      "Opções de pausa: respiração, desenho livre",
      "Atividades graduais: fácil → médio → difícil"
    ],
    tags: ["emocional", "autorregulacao", "humor"]
  },

  // ESTRATÉGIAS PARA TRANSTORNOS DE ANSIEDADE
  {
    id: "reducao-pressao",
    groupLabel: "Ambiente de Baixa Pressão",
    targetConditions: ["Transtornos de Ansiedade", "Mutismo Seletivo", "Fobia Social"],
    signals: [
      "evita responder perguntas oralmente",
      "mostra sinais físicos de ansiedade",
      "necessita de muito tempo para responder",
      "performance varia drasticamente"
    ],
    strategy: {
      name: "Reduzir pressão de performance e criar ambientes seguros",
      implementation: [
        "Oferecer múltiplas formas de resposta",
        "Eliminar elementos de competição",
        "Permitir respostas privadas/escritas",
        "Celebrar tentativas, não apenas acertos"
      ],
      materials: ["respostas escritas", "sinais não-verbais", "espaço privado"]
    },
    foundation: {
      theory: "Teoria da Ansiedade de Teste (Sarason)",
      evidence: "Reduz ansiedade de performance em 55%",
      studies: ["Eysenck (1992)", "Zeidner (1998)"]
    },
    examples: [
      "Opção de resposta escrita ao invés de oral",
      "Sem tempo limite rígido",
      "'Vamos explorar juntos' ao invés de 'teste'"
    ],
    tags: ["ansiedade", "pressao", "performance"]
  },

  // ESTRATÉGIAS PARA ALTAS HABILIDADES/SUPERDOTAÇÃO
  {
    id: "enriquecimento-complexidade",
    groupLabel: "Enriquecimento e Complexidade Adicional",
    targetConditions: ["Altas Habilidades", "Superdotação", "Talento Específico"],
    signals: [
      "completa atividades muito rapidamente",
      "demonstra tédio ou desinteresse",
      "faz perguntas além do conteúdo",
      "busca desafios maiores"
    ],
    strategy: {
      name: "Oferecer extensões e aprofundamentos opcionais",
      implementation: [
        "Incluir atividades de extensão opcional",
        "Permitir pesquisa independente",
        "Conectar com conceitos avançados",
        "Oferecer projetos de longo prazo"
      ],
      materials: ["recursos adicionais", "projetos opcionais", "pesquisa independente"]
    },
    foundation: {
      theory: "Modelo Triádico de Enriquecimento (Renzulli)",
      evidence: "Mantém engajamento em 80% dos casos",
      studies: ["Renzulli (2012)", "Reis & Renzulli (2010)"]
    },
    examples: [
      "Se terminar rápido: 'Pesquise aplicações reais deste conceito'",
      "Conexões: 'Como isso se relaciona com...?'",
      "Projetos: criar apresentação ou experimento"
    ],
    tags: ["altas-habilidades", "enriquecimento", "desafio"]
  },

  // ESTRATÉGIAS PARA DIFICULDADES PSICOMOTORAS
  {
    id: "adaptacoes-motoras",
    groupLabel: "Adaptações Psicomotoras",
    targetConditions: ["Dispraxia", "Dificuldades Motoras", "Paralisia Cerebral"],
    signals: [
      "dificuldade com escrita manual",
      "problemas de coordenação fina",
      "fadiga rápida em atividades motoras",
      "dificuldade com organização espacial"
    ],
    strategy: {
      name: "Adaptar demandas motoras e oferecer alternativas",
      implementation: [
        "Reduzir quantidade de escrita manual",
        "Oferecer alternativas digitais",
        "Usar materiais com pegada facilitada",
        "Permitir respostas orais quando apropriado"
      ],
      materials: ["computador/tablet", "engrossadores de lápis", "papel pautado especial"]
    },
    foundation: {
      theory: "Teoria do Desenvolvimento Motor (Gallahue)",
      evidence: "Melhora participação em 65% dos casos",
      studies: ["Henderson & Sugden (2007)", "Missiuna (2001)"]
    },
    examples: [
      "Múltipla escolha ao invés de resposta escrita longa",
      "Uso de tablet para desenhos geométricos",
      "Colagem ao invés de desenho livre"
    ],
    tags: ["motor", "adaptacao", "alternativo"]
  }
];

/**
 * Função principal para popular a base de conhecimento
 */
async function seedKnowledge() {
  try {
    console.log('🌱 Iniciando seed da base de conhecimento...');

    // Conectar ao banco
    await sequelize.authenticate();
    console.log('✅ Conexão com banco estabelecida');

    // Limpar dados existentes (cuidado em produção!)
    await sequelize.query('DELETE FROM embeddings WHERE sourceTable = $1', {
      bind: ['knowledge_nodes'],
      type: sequelize.QueryTypes.DELETE
    });

    await sequelize.query('DELETE FROM knowledge_nodes', {
      type: sequelize.QueryTypes.DELETE
    });

    console.log('🗑️ Dados existentes removidos');

    // Inserir cada nó de conhecimento
    for (const node of KNOWLEDGE_BASE) {
      console.log(`📚 Processando: ${node.id}`);

      // Inserir no banco
      await sequelize.query(`
        INSERT INTO knowledge_nodes (
          id, groupLabel, targetConditions, signals, strategy,
          foundation, examples, status, createdAt, updatedAt
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, {
        bind: [
          node.id,
          node.groupLabel,
          JSON.stringify(node.targetConditions),
          JSON.stringify(node.signals),
          JSON.stringify(node.strategy),
          JSON.stringify(node.foundation),
          JSON.stringify(node.examples),
          'ATIVO',
          new Date().toISOString(),
          new Date().toISOString()
        ],
        type: sequelize.QueryTypes.INSERT
      });

      // Gerar e salvar embedding
      await embeddingService.indexKnowledgeNode(node);

      console.log(`✅ ${node.id} indexado com sucesso`);
    }

    console.log(`🎉 Base de conhecimento populada com ${KNOWLEDGE_BASE.length} nós!`);

    // Verificar embeddings criados
    const [{ count }] = await sequelize.query(`
      SELECT COUNT(*) as count FROM embeddings WHERE sourceTable = 'knowledge_nodes'
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    console.log(`📊 Total de embeddings criados: ${count}`);

    // Teste de consulta RAG
    console.log('\n🔍 Testando consulta RAG...');
    const testResults = await embeddingService.ragQuery('estudante com autismo tem dificuldade de atenção', 3);

    console.log(`📋 Resultados do teste (${testResults.length} encontrados):`);
    testResults.forEach((result, index) => {
      console.log(`${index + 1}. ${result.nodeDetails?.groupLabel || result.sourceId} (${(result.similarity * 100).toFixed(1)}% similaridade)`);
    });

  } catch (error) {
    console.error('❌ Erro no seed:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 Conexão encerrada');
  }
}

/**
 * Função para adicionar um novo nó de conhecimento
 */
async function addKnowledgeNode(nodeData) {
  try {
    await sequelize.authenticate();

    // Inserir nó
    await sequelize.query(`
      INSERT INTO knowledge_nodes (
        id, groupLabel, targetConditions, signals, strategy,
        foundation, examples, contraindications, tags, lastUpdated
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        groupLabel = $2, targetConditions = $3, signals = $4,
        strategy = $5, foundation = $6, examples = $7,
        contraindications = $8, tags = $9, lastUpdated = $10
    `, {
      bind: [
        nodeData.id,
        nodeData.groupLabel,
        nodeData.targetConditions,
        nodeData.signals,
        JSON.stringify(nodeData.strategy),
        JSON.stringify(nodeData.foundation),
        nodeData.examples,
        nodeData.contraindications,
        nodeData.tags,
        nodeData.lastUpdated || new Date().toISOString().split('T')[0]
      ],
      type: sequelize.QueryTypes.INSERT
    });

    // Re-indexar embedding
    await embeddingService.indexKnowledgeNode(nodeData);

    console.log(`✅ Nó ${nodeData.id} adicionado/atualizado com sucesso`);

  } catch (error) {
    console.error('❌ Erro ao adicionar nó:', error);
  } finally {
    await sequelize.close();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const command = process.argv[2];

  if (command === 'seed') {
    seedKnowledge();
  } else if (command === 'add') {
    console.log('Para adicionar um nó, use: node scripts/seedKnowledge.js add [dados-do-no]');
  } else {
    console.log('Comandos disponíveis:');
    console.log('  node scripts/seedKnowledge.js seed    # Popular base completa');
    console.log('  node scripts/seedKnowledge.js add     # Adicionar nó específico');
  }
}

module.exports = {
  seedKnowledge,
  addKnowledgeNode,
  KNOWLEDGE_BASE
};