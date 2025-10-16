import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import MultiStepForm from "@/components/MultiStepForm";

export default async function NovoAlunoPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

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
            <span className="text-lg font-medium">Novo Aluno</span>
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
          <h1 className="text-3xl font-bold mb-2">Cadastrar Novo Aluno</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Preencha as informações do perfil do aluno. Você pode salvar e
            continuar depois.
          </p>
        </div>

        <MultiStepForm />
      </main>
    </div>
  );
}
