import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { students } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import MultiStepForm from "@/components/MultiStepForm";

export default async function EditarAlunoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = parseInt(session.user.id);
  if (isNaN(userId)) {
    redirect("/login");
  }

  const [student] = await db
    .select()
    .from(students)
    .where(and(eq(students.id, id), eq(students.userId, userId)));

  if (!student) {
    redirect("/alunos");
  }

  // Converter os dados do banco para o formato esperado pelo formulário
  const formData = {
    // Metadados
    secaoAtual: student.secaoAtual || 1,
    progressoFormulario: student.progressoFormulario || 0,
    concluido: student.concluido || false,
    // Seção 1
    nomeCompleto: student.nomeCompleto,
    dataNascimento: student.dataNascimento?.toString() || "",
    idade: student.idade,
    anoEscolar: student.anoEscolar,
    responsavelPreenchimento: student.responsavelPreenchimento,
    arranjoMoradia: student.arranjoMoradia || undefined,
    relacionamentoPais: student.relacionamentoPais || undefined,
    relacionamentoMae: student.relacionamentoMae || undefined,
    relacionamentoPai: student.relacionamentoPai || undefined,
    relacionamentoIrmaos: student.relacionamentoIrmaos || undefined,
    relacionamentoFamilia: student.relacionamentoFamilia || undefined,
    motivoPrincipal: student.motivoPrincipal || undefined,
    diagnosticos: (student.diagnosticos as string[]) || undefined,
    terapias: student.terapias || undefined,
    marcosDesenvolvimento: student.marcosDesenvolvimento || undefined,
    condicoesMedicas: student.condicoesMedicas || undefined,
    historicoFamiliar: student.historicoFamiliar || undefined,
    perfilAudicao: student.perfilAudicao || undefined,
    perfilVisao: student.perfilVisao || undefined,
    perfilTato: student.perfilTato || undefined,
    perfilPaladarOlfato: student.perfilPaladarOlfato || undefined,
    perfilVestibular: student.perfilVestibular || undefined,
    perfilPropriocepcao: student.perfilPropriocepcao || undefined,
    perfilInterocepcao: student.perfilInterocepcao || undefined,
    iniciacaoTarefa: student.iniciacaoTarefa || undefined,
    atencaoSustentada: student.atencaoSustentada || undefined,
    planejamentoSequenciamento: student.planejamentoSequenciamento || undefined,
    organizacao: student.organizacao || undefined,
    memoriaTrabalho: student.memoriaTrabalho || undefined,
    controleImpulsos: student.controleImpulsos || undefined,
    flexibilidadeCognitiva: student.flexibilidadeCognitiva || undefined,
    automonitoria: student.automonitoria || undefined,
    velocidadeProcessamento: student.velocidadeProcessamento || undefined,
    linguagemExpressiva: student.linguagemExpressiva || undefined,
    linguagemReceptiva: student.linguagemReceptiva || undefined,
    linguagemPragmatica: student.linguagemPragmatica || undefined,
    comunicacaoNaoVerbal: student.comunicacaoNaoVerbal || undefined,
    literalidade: student.literalidade || undefined,
    motivacaoSocial: student.motivacaoSocial || undefined,
    relacoesPares: student.relacoesPares || undefined,
    teoriaMente: student.teoriaMente || undefined,
    comportamentoGrupo: student.comportamentoGrupo || undefined,
    regulacaoEmocional: student.regulacaoEmocional || undefined,
    gatilhosComportamentais: student.gatilhosComportamentais || undefined,
    comportamentosRepetitivos: student.comportamentosRepetitivos || undefined,
    reacaoLimites: student.reacaoLimites || undefined,
    resiliencia: student.resiliencia || undefined,
    motricidadeFina: student.motricidadeFina || undefined,
    motricidadeGrossa: student.motricidadeGrossa || undefined,
    hiperfocos: student.hiperfocos || undefined,
    superpoderes: student.superpoderes || undefined,
    sistemaRecompensa: student.sistemaRecompensa || undefined,
    objetivos: (student.objetivos as string[]) || undefined,
    informacoesAdicionais: student.informacoesAdicionais || undefined,
    possuiLaudo: student.possuiLaudo || undefined,
    laudoTexto: student.laudoTexto || undefined,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-2xl font-bold text-blue-600 hover:text-blue-700"
            >
              Educa AI
            </Link>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <Link
              href="/alunos"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              Alunos
            </Link>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-lg font-medium">{student.nomeCompleto}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {session.user.name}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Editar Perfil: {student.nomeCompleto}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Continue preenchendo ou editando as informações do perfil do aluno.
          </p>
        </div>

        <MultiStepForm initialData={formData} studentId={student.id} />
      </main>
    </div>
  );
}
