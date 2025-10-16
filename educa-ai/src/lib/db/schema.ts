import { pgTable, serial, timestamp, varchar, text, uuid, boolean, date, integer, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const historicoFamiliarEnum = pgEnum("historico_familiar", ["sim", "nao", "nao_sei"]);
export const atividadeStatusEnum = pgEnum("atividade_status", [
  "pendente",
  "processando",
  "convertendo",
  "extraindo_texto",
  "adaptando",
  "finalizando",
  "adaptada",
  "erro",
  "erro_processamento"
]);

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  isFirstAccess: boolean("is_first_access").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Students Table
export const students = pgTable("students", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Seção 1: Informações Gerais
  nomeCompleto: varchar("nome_completo", { length: 255 }).notNull(),
  dataNascimento: date("data_nascimento").notNull(),
  idade: varchar("idade", { length: 50 }).notNull(),
  anoEscolar: varchar("ano_escolar", { length: 100 }).notNull(),
  responsavelPreenchimento: text("responsavel_preenchimento").notNull(),

  // Seção 2: Contexto Familiar e Social
  arranjoMoradia: text("arranjo_moradia"),
  relacionamentoPais: text("relacionamento_pais"),
  relacionamentoMae: text("relacionamento_mae"),
  relacionamentoPai: text("relacionamento_pai"),
  relacionamentoIrmaos: text("relacionamento_irmaos"),
  relacionamentoFamilia: text("relacionamento_familia"),

  // Seção 3: Histórico de Saúde
  motivoPrincipal: text("motivo_principal"),
  diagnosticos: jsonb("diagnosticos"),
  terapias: text("terapias"),
  marcosDesenvolvimento: text("marcos_desenvolvimento"),
  condicoesMedicas: text("condicoes_medicas"),
  historicoFamiliar: historicoFamiliarEnum("historico_familiar"),

  // Seção 4: Perfil Sensorial
  perfilAudicao: text("perfil_audicao"),
  perfilVisao: text("perfil_visao"),
  perfilTato: text("perfil_tato"),
  perfilPaladarOlfato: text("perfil_paladar_olfato"),
  perfilVestibular: text("perfil_vestibular"),
  perfilPropriocepcao: text("perfil_propriocepcao"),
  perfilInterocepcao: text("perfil_interocepcao"),

  // Seção 5: Funções Executivas
  iniciacaoTarefa: text("iniciacao_tarefa"),
  atencaoSustentada: text("atencao_sustentada"),
  planejamentoSequenciamento: text("planejamento_sequenciamento"),
  organizacao: text("organizacao"),
  memoriaTrabalho: text("memoria_trabalho"),
  controleImpulsos: text("controle_impulsos"),
  flexibilidadeCognitiva: text("flexibilidade_cognitiva"),
  automonitoria: text("automonitoria"),
  velocidadeProcessamento: text("velocidade_processamento"),

  // Seção 6: Comunicação e Socialização
  linguagemExpressiva: text("linguagem_expressiva"),
  linguagemReceptiva: text("linguagem_receptiva"),
  linguagemPragmatica: text("linguagem_pragmatica"),
  comunicacaoNaoVerbal: text("comunicacao_nao_verbal"),
  literalidade: text("literalidade"),
  motivacaoSocial: text("motivacao_social"),
  relacoesPares: text("relacoes_pares"),
  teoriaMente: text("teoria_mente"),
  comportamentoGrupo: text("comportamento_grupo"),

  // Seção 7: Perfil Comportamental
  regulacaoEmocional: text("regulacao_emocional"),
  gatilhosComportamentais: text("gatilhos_comportamentais"),
  comportamentosRepetitivos: text("comportamentos_repetitivos"),
  reacaoLimites: text("reacao_limites"),
  resiliencia: text("resiliencia"),

  // Seção 8: Habilidades Motoras
  motricidadeFina: text("motricidade_fina"),
  motricidadeGrossa: text("motricidade_grossa"),

  // Seção 9: Pontos Fortes
  hiperfocos: text("hiperfocos"),
  superpoderes: text("superpoderes"),
  sistemaRecompensa: text("sistema_recompensa"),

  // Seção 10: Objetivos
  objetivos: jsonb("objetivos"),
  informacoesAdicionais: text("informacoes_adicionais"),

  // Laudo Médico (Opcional)
  possuiLaudo: boolean("possui_laudo").default(false),
  laudoTexto: text("laudo_texto"),
  laudoArquivo: varchar("laudo_arquivo", { length: 500 }),
  laudoTipoArquivo: varchar("laudo_tipo_arquivo", { length: 100 }),
  laudoNomeOriginal: varchar("laudo_nome_original", { length: 500 }),
  laudoUrl: varchar("laudo_url", { length: 1000 }),

  // Campos de Atividade para Adaptação
  atividadeArquivo: varchar("atividade_arquivo", { length: 500 }),
  atividadeTipoArquivo: varchar("atividade_tipo_arquivo", { length: 100 }),
  atividadeNomeOriginal: varchar("atividade_nome_original", { length: 500 }),
  atividadeUrl: varchar("atividade_url", { length: 1000 }),
  atividadeStatus: atividadeStatusEnum("atividade_status").default("pendente"),
  adaptacaoCompleta: text("adaptacao_completa"),

  // Metadados
  progressoFormulario: integer("progresso_formulario").default(0),
  secaoAtual: integer("secao_atual").default(1),
  concluido: boolean("concluido").default(false),

  // Foreign Key
  userId: integer("user_id").notNull().references(() => users.id),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  students: many(students),
}));

export const studentsRelations = relations(students, ({ one }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
}));
