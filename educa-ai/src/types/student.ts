export interface StudentFormData {
  // Metadados
  secaoAtual?: number;
  progressoFormulario?: number;
  concluido?: boolean;

  // Seção 1: Informações Gerais
  nomeCompleto: string;
  dataNascimento: string;
  idade: string;
  anoEscolar: string;
  responsavelPreenchimento: string;

  // Seção 2: Contexto Familiar e Social
  arranjoMoradia?: string;
  relacionamentoPais?: string;
  relacionamentoMae?: string;
  relacionamentoPai?: string;
  relacionamentoIrmaos?: string;
  relacionamentoFamilia?: string;

  // Seção 3: Histórico de Saúde
  motivoPrincipal?: string;
  diagnosticos?: string[];
  terapias?: string;
  marcosDesenvolvimento?: string;
  condicoesMedicas?: string;
  historicoFamiliar?: "sim" | "nao" | "nao_sei";

  // Seção 4: Perfil Sensorial
  perfilAudicao?: string;
  perfilVisao?: string;
  perfilTato?: string;
  perfilPaladarOlfato?: string;
  perfilVestibular?: string;
  perfilPropriocepcao?: string;
  perfilInterocepcao?: string;

  // Seção 5: Funções Executivas
  iniciacaoTarefa?: string;
  atencaoSustentada?: string;
  planejamentoSequenciamento?: string;
  organizacao?: string;
  memoriaTrabalho?: string;
  controleImpulsos?: string;
  flexibilidadeCognitiva?: string;
  automonitoria?: string;
  velocidadeProcessamento?: string;

  // Seção 6: Comunicação e Socialização
  linguagemExpressiva?: string;
  linguagemReceptiva?: string;
  linguagemPragmatica?: string;
  comunicacaoNaoVerbal?: string;
  literalidade?: string;
  motivacaoSocial?: string;
  relacoesPares?: string;
  teoriaMente?: string;
  comportamentoGrupo?: string;

  // Seção 7: Perfil Comportamental
  regulacaoEmocional?: string;
  gatilhosComportamentais?: string;
  comportamentosRepetitivos?: string;
  reacaoLimites?: string;
  resiliencia?: string;

  // Seção 8: Habilidades Motoras
  motricidadeFina?: string;
  motricidadeGrossa?: string;

  // Seção 9: Pontos Fortes
  hiperfocos?: string;
  superpoderes?: string;
  sistemaRecompensa?: string;

  // Seção 10: Objetivos
  objetivos?: string[];
  informacoesAdicionais?: string;

  // Laudo Médico
  possuiLaudo?: boolean;
  laudoTexto?: string;
}
