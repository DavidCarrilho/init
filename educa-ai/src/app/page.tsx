import { auth } from "@/lib/auth";
import { logout } from "@/app/actions/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <main className="text-center">
          <h1 className="text-4xl font-bold mb-4">Educa AI</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Plataforma educacional com inteligência artificial
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              href="/cadastro"
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
            >
              Criar Conta
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Educa AI</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {session.user.name}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-4">
          Bem-vindo, {session.user.name}!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Você está logado na plataforma Educa AI
        </p>
      </main>
    </div>
  );
}
