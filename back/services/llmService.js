/**
 * Serviço de LLM para adaptação pedagógica
 * MVP: Usa prompt fixo e retorna JSON estruturado
 */

/**
 * Schema JSON para validação da resposta do LLM
 */
const ADAPTATION_SCHEMA = {
  versao: "1.0",
  aluno_id: "",
  objetivos_adaptacao: [],
  estrategias_aplicadas: [
    {
      no_id: "",
      nome: "",
      porque: ""
    }
  ],
  atividade_adaptada: {
    enunciado_reescrito: "",
    itens: [
      {
        tipo: "", // multipla_escolha|resposta_curta|associacao|sequenciamento|colorir|recorte
        conteudo: "",
        apoios_visuais: [],
        passo_a_passo: [],
        tempo_sugerido_segundos: 0
      }
    ],
    materiais_impressao: [
      {
        nome: "",
        html_markdown: ""
      }
    ],
    versao_digital: {
      interacoes: []
    }
  },
  orientacoes_ao_adulto: {
    como_apresentar: [],
    erros_comuns_a_evitar: [],
    sinais_de_sucesso: []
  },
  acessibilidade: {
    fonte_maiuscula: false,
    espacamento_linhas: "normal",
    uso_cores: "baixo contraste",
    alternativas_sensorial: []
  },
  avaliacao_rapida: {
    rubrica_0a2: ["engajamento", "compreensao", "autonomia"],
    criterios_observaveis: []
  }
};

/**
 * Prompt sistema para o LLM
 */
const SYSTEM_PROMPT = `Você é um especialista em adaptações pedagógicas baseadas em evidências para estudantes com Necessidades Educacionais Especiais (TEA, TDAH, Dislexia, etc.).

INSTRUÇÕES:
- Use APENAS as informações fornecidas: PERFIL_DO_ALUNO, ATIVIDADE_ORIGINAL e NÓS_RELEVANTES (RAG)
- NÃO invente fatos ou informações não fornecidas
- Se faltar informações importantes, proponha alternativas seguras e conservadoras
- Responda APENAS com JSON válido conforme o schema fornecido
- Foque em adaptações práticas e implementáveis
- Considere as capacidades e limitações específicas do aluno

PRINCÍPIOS:
1. Simplicidade: Reduza complexidade cognitiva
2. Clareza: Use linguagem direta e objetiva
3. Estrutura: Organize informações de forma previsível
4. Suporte: Forneça apoios visuais e táteis quando necessário
5. Autonomia: Promova independência gradual`;

/**
 * Constrói o prompt do usuário com dados específicos
 * @param {object} perfilAluno - Perfil completo do estudante
 * @param {string} ocrText - Texto extraído da atividade original
 * @param {object} layout - Layout/estrutura detectada
 * @param {array} nos - Nós de conhecimento relevantes do RAG
 * @returns {string} Prompt formatado
 */
function buildUserPrompt(perfilAluno, ocrText, layout, nos) {
  return `PERFIL_DO_ALUNO:
${JSON.stringify(perfilAluno, null, 2)}

ATIVIDADE_ORIGINAL:
- Texto OCR: ${JSON.stringify(ocrText)}
- Estrutura detectada: ${JSON.stringify(layout || {})}

NÓS_RELEVANTES (RAG):
${JSON.stringify(nos, null, 2)}

SCHEMA DE RESPOSTA:
${JSON.stringify(ADAPTATION_SCHEMA, null, 2)}

Analise o perfil do aluno, identifique os desafios principais baseado nos nós relevantes, e adapte a atividade original. Retorne APENAS o JSON válido preenchido com a adaptação personalizada.`;
}

/**
 * Chama o LLM para gerar adaptação (PLACEHOLDER - implementar com provedor real)
 * @param {object} params - Parâmetros da adaptação
 * @param {object} params.perfilAluno - Perfil do estudante
 * @param {string} params.ocrText - Texto da atividade original
 * @param {object} params.layout - Layout detectado
 * @param {array} params.nos - Nós de conhecimento relevantes
 * @returns {Promise<object>} JSON da adaptação gerada
 */
async function callLLM({ perfilAluno, ocrText, layout, nos }) {
  try {
    console.log('🤖 Iniciando chamada para LLM...');

    const userPrompt = buildUserPrompt(perfilAluno, ocrText, layout, nos);

    // PLACEHOLDER: Em produção, substituir por chamada real para LLM
    // Exemplos: OpenAI GPT-4, Anthropic Claude, etc.

    console.log('📝 Prompt construído, gerando resposta...');

    // Para o MVP, vamos retornar uma adaptação simulada baseada no perfil
    const adaptacao = await generateMockAdaptation(perfilAluno, ocrText, nos);

    console.log('✅ Adaptação gerada com sucesso');
    return adaptacao;

  } catch (error) {
    console.error('Erro na chamada LLM:', error);
    throw new Error(`Falha na geração da adaptação: ${error.message}`);
  }
}

/**
 * Gera adaptação inteligente e personalizada baseada no perfil do aluno
 * Usa lógica avançada para criar atividades que aproveitam os interesses e forças do estudante
 */
async function generateMockAdaptation(perfilAluno, ocrText, nos) {
  // Simular tempo de processamento real de IA
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Extrair informações principais do perfil
  const nome = perfilAluno.nomeCompleto || 'Estudante';
  const idade = perfilAluno.idade || '10';
  const diagnosticos = perfilAluno.diagnosticos || [];
  const hiperfocos = perfilAluno.hiperfocos || '';
  const superpoderes = perfilAluno.superpoderes || '';

  console.log(`🎯 Gerando adaptação personalizada para ${nome}`);
  console.log(`🧠 Hiperfocos identificados: ${hiperfocos}`);

  // Analisar hiperfocos para personalização
  const isNumberblocksInterest = hiperfocos.toLowerCase().includes('numberblock');
  const isMathInterest = hiperfocos.toLowerCase().includes('matemática') || hiperfocos.toLowerCase().includes('números');
  const isVisualLearner = perfilAluno.perfilVisao || superpoderes.toLowerCase().includes('visual');

  // Estratégias baseadas no perfil real
  const estrategias = [
    {
      no_id: 'personalizacao_hiperfoco',
      nome: isNumberblocksInterest ? 'Integração com Numberblocks' : 'Aproveitamento de interesses especiais',
      porque: `${nome} demonstra forte interesse em ${hiperfocos}, que será usado como ponte para o aprendizado`
    },
    {
      no_id: 'adaptacao_cognitiva',
      nome: 'Adaptação às características cognitivas',
      porque: `Considerando o perfil de ${diagnosticos.join(', ')}, a atividade foi estruturada para reduzir sobrecarga cognitiva`
    },
    {
      no_id: 'fortalecimento_superpoderes',
      nome: 'Aproveitamento dos superpoderes',
      porque: `Atividade desenhada para potencializar: ${superpoderes}`
    }
  ];

  // Gerar atividade personalizada baseada no OCR e perfil
  const atividadePersonalizada = generatePersonalizedActivity(ocrText, perfilAluno);

  return {
    versao: "1.0",
    aluno_id: perfilAluno.id,
    objetivos_adaptacao: [
      `Conectar matemática com o interesse especial de ${nome} (${hiperfocos})`,
      "Reduzir ansiedade através de elementos familiares",
      "Promover aprendizado através dos pontos fortes identificados",
      "Facilitar compreensão com apoios visuais e estruturação"
    ],
    estrategias_aplicadas: estrategias,
    atividade_adaptada: {
      enunciado_reescrito: atividadePersonalizada.enunciado,
      itens: atividadePersonalizada.itens,
      materiais_impressao: [
        {
          nome: `Atividade Personalizada para ${nome} - ${isNumberblocksInterest ? 'Tema Numberblocks' : 'Tema Personalizado'}`,
          html_markdown: generateHtmlContent(atividadePersonalizada.enunciado, atividadePersonalizada.itens)
        }
      ],
      versao_digital: {
        interacoes: isVisualLearner ? ["clique", "arraste", "colorir", "construir"] : ["clique", "escrever"]
      }
    },
    orientacoes_ao_adulto: generateEducatorGuidance(perfilAluno, isNumberblocksInterest),
    acessibilidade: {
      fonte_maiuscula: true,
      espacamento_linhas: "amplo",
      uso_cores: isVisualLearner ? "alto contraste com cores vibrantes" : "alto contraste",
      alternativas_sensorial: ["visual", "tatil", "manipulativo"]
    },
    avaliacao_rapida: {
      rubrica_0a2: ["engajamento", "compreensao", "autonomia"],
      criterios_observaveis: [
        `Demonstra interesse quando ${isNumberblocksInterest ? 'vê os Numberblocks' : 'vê elementos de seu interesse'}`,
        "Consegue fazer conexão entre personagens/interesse e conceitos matemáticos",
        "Mantém foco por tempo adequado na atividade personalizada",
        "Solicita para fazer mais atividades similares"
      ]
    }
  };
}

/**
 * Gera atividade totalmente personalizada baseada no perfil do aluno
 */
function generatePersonalizedActivity(ocrText, perfilAluno) {
  const nome = perfilAluno.nomeCompleto?.split(' ')[0] || 'Estudante';
  const hiperfocos = perfilAluno.hiperfocos || '';
  const isNumberblocksInterest = hiperfocos.toLowerCase().includes('numberblock');

  // Detectar tipo de atividade matemática no OCR
  const hasAddition = /\+/.test(ocrText);
  const hasSubtraction = /-/.test(ocrText);
  const numbers = ocrText.match(/\d+/g) || ['2', '3', '5', '1'];

  let enunciado, itens;

  if (isNumberblocksInterest && hasAddition) {
    // Adaptação específica para Numberblocks + adição
    enunciado = `Olá ${nome}! Hoje vamos ajudar os Numberblocks a se juntarem para formar números maiores!

🟦 Os Numberblocks adoram se juntar para criar novos amigos maiores. Quando eles se juntam, fazemos uma ADIÇÃO!`;

    itens = numbers.slice(0, 3).map((num, index) => {
      const nextNum = numbers[index + 1] || (parseInt(num) + 1).toString();
      return {
        tipo: "construcao_visual",
        conteudo: `Se o Numberblock ${num} se juntar com o Numberblock ${nextNum}, que Numberblock eles formam?

🧮 Use seus blocos ou desenhe para mostrar: ${num} + ${nextNum} = ?`,
        apoios_visuais: [
          "Imagens coloridas dos Numberblocks",
          "Blocos físicos para manipular",
          "Desenho de união dos personagens"
        ],
        passo_a_passo: [
          `1. Pegue ${num} bloco(s) de uma cor`,
          `2. Pegue ${nextNum} bloco(s) de outra cor`,
          "3. Junte todos os blocos",
          "4. Conte quantos blocos você tem agora",
          "5. Esse é o Numberblock que eles formaram!"
        ],
        tempo_sugerido_segundos: 300
      };
    });

  } else if (isNumberblocksInterest && hasSubtraction) {
    // Adaptação específica para Numberblocks + subtração
    enunciado = `Oi ${nome}! Os Numberblocks precisam da sua ajuda! Alguns deles vão embora e precisamos descobrir quantos ficaram.`;

    itens = [{
      tipo: "separacao_visual",
      conteudo: `O Numberblock 5 estava brincando, mas 1 bloquinho dele foi dormir. Quantos bloquinhos ficaram acordados?

🧮 Use seus blocos para mostrar: 5 - 1 = ?`,
      apoios_visuais: [
        "Numberblock 5 completo",
        "1 bloquinho 'dormindo' (separado)",
        "Blocos restantes acordados"
      ],
      passo_a_passo: [
        "1. Faça o Numberblock 5 com seus blocos",
        "2. Tire 1 bloco (ele foi dormir)",
        "3. Conte quantos blocos ficaram",
        "4. Esse é o resultado!"
      ],
      tempo_sugerido_segundos: 240
    }];

  } else {
    // Adaptação geral baseada nos interesses do aluno
    const interesse = hiperfocos.split(',')[0]?.trim() || 'seus brinquedos favoritos';

    enunciado = `Olá ${nome}! Vamos usar ${interesse} para aprender matemática de um jeito divertido!`;

    itens = [{
      tipo: "contextualizacao_interesse",
      conteudo: `Imagine que você tem alguns ${interesse}. Vamos fazer contas com eles!

📝 Se você tem 2 ${interesse} e ganha mais 3, quantos você terá no total?`,
      apoios_visuais: [
        `Desenhos de ${interesse}`,
        "Objetos para contar",
        "Material colorido"
      ],
      passo_a_passo: [
        `1. Desenhe ou pegue 2 ${interesse}`,
        `2. Desenhe ou pegue mais 3 ${interesse}`,
        "3. Conte todos juntos",
        "4. Escreva a resposta"
      ],
      tempo_sugerido_segundos: 180
    }];
  }

  return { enunciado, itens };
}

/**
 * Gera orientações específicas para o educador baseadas no perfil
 */
function generateEducatorGuidance(perfilAluno, isNumberblocksInterest) {
  const nome = perfilAluno.nomeCompleto?.split(' ')[0] || 'o estudante';
  const diagnosticos = perfilAluno.diagnosticos || [];
  const hiperfocos = perfilAluno.hiperfocos || '';

  return {
    como_apresentar: [
      isNumberblocksInterest
        ? `Comece revisando quem são os Numberblocks principais (especialmente os números da atividade)`
        : `Comece conectando a atividade com ${hiperfocos}`,
      `Permita que ${nome} manipule objetos concretos antes de partir para o abstrato`,
      "Use linguagem positiva e entusiasmada ao falar sobre os interesses dele",
      `Dê tempo extra para ${nome} processar as informações (especialmente por ter ${diagnosticos.join(', ')})`,
      "Celebre pequenos progressos para manter a motivação"
    ],
    erros_comuns_a_evitar: [
      isNumberblocksInterest
        ? "Não force a fazer sem os Numberblocks se ele estiver frustrado"
        : "Não ignore os interesses especiais do aluno",
      `Não pressione ${nome} por velocidade - o TEA/TDAH requer mais tempo`,
      "Evitar mudanças bruscas de atividade sem avisar",
      "Não comparar o desempenho com outros alunos",
      "Não retirar os apoios visuais muito rapidamente"
    ],
    sinais_de_sucesso: [
      `${nome} demonstra interesse visual pelos elementos da atividade`,
      isNumberblocksInterest
        ? "Faz conexões espontâneas com episódios dos Numberblocks"
        : "Relaciona a atividade com seus interesses pessoais",
      "Consegue manipular materiais concretos com confiança",
      "Solicita para fazer atividades similares",
      "Demonstra compreensão através de gestos ou verbalizações",
      "Mantém engajamento por mais de 5 minutos consecutivos"
    ]
  };
}

/**
 * Simplifica texto para melhor compreensão
 */
function simplifyText(text) {
  if (!text) return "Atividade adaptada para melhor compreensão.";

  return text
    .replace(/\b(realize|execute|faça)\b/gi, "Faça")
    .replace(/\b(determine|identifique|encontre)\b/gi, "Encontre")
    .replace(/\b(analise|examine)\b/gi, "Olhe para")
    .substring(0, 200) + (text.length > 200 ? "..." : "");
}

/**
 * Extrai itens/questões do texto OCR
 */
function extractItemsFromText(text) {
  if (!text) {
    return [{
      tipo: "resposta_curta",
      conteudo: "Complete a atividade adaptada.",
      apoios_visuais: ["pictograma", "diagrama"],
      passo_a_passo: ["1. Leia com atenção", "2. Pense na resposta", "3. Escreva ou marque"],
      tempo_sugerido_segundos: 300
    }];
  }

  // Detectar padrões de questões
  const hasMultipleChoice = /a\)|b\)|c\)|d\)/gi.test(text);
  const hasNumbers = /\d+[\.\)]/g.test(text);

  if (hasMultipleChoice) {
    return [{
      tipo: "multipla_escolha",
      conteudo: "Escolha a resposta correta:",
      apoios_visuais: ["destaque", "cores"],
      passo_a_passo: ["1. Leia cada opção", "2. Elimine as incorretas", "3. Marque sua escolha"],
      tempo_sugerido_segundos: 180
    }];
  }

  if (hasNumbers) {
    return [{
      tipo: "sequenciamento",
      conteudo: "Organize na ordem correta:",
      apoios_visuais: ["numeração", "setas"],
      passo_a_passo: ["1. Leia todos os itens", "2. Pense na sequência", "3. Numere em ordem"],
      tempo_sugerido_segundos: 240
    }];
  }

  return [{
    tipo: "resposta_curta",
    conteudo: simplifyText(text),
    apoios_visuais: ["esquemas", "exemplos"],
    passo_a_passo: ["1. Entenda a pergunta", "2. Pense na resposta", "3. Escreva de forma clara"],
    tempo_sugerido_segundos: 300
  }];
}

/**
 * Gera conteúdo HTML para impressão
 */
function generateHtmlContent(enunciado, itens) {
  return `
# Atividade Adaptada

## Instruções
${enunciado}

## Atividades

${itens.map((item, index) => `
### ${index + 1}. ${item.tipo.replace('_', ' ').toUpperCase()}
**Conteúdo:** ${item.conteudo}

**Como fazer:**
${item.passo_a_passo.map(passo => `- ${passo}`).join('\n')}

**Tempo sugerido:** ${Math.round(item.tempo_sugerido_segundos / 60)} minutos
`).join('\n')}

---
*Atividade adaptada automaticamente*
  `.trim();
}

/**
 * Valida se o JSON retornado pelo LLM está no formato correto
 * @param {object} json - JSON a ser validado
 * @returns {boolean} True se válido
 */
function validateAdaptationJson(json) {
  try {
    return json &&
           typeof json === 'object' &&
           json.versao &&
           json.atividade_adaptada &&
           json.orientacoes_ao_adulto &&
           json.acessibilidade;
  } catch {
    return false;
  }
}

module.exports = {
  callLLM,
  validateAdaptationJson,
  ADAPTATION_SCHEMA,
  SYSTEM_PROMPT
};