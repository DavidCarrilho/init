"use client";

import { useState } from "react";
import { register } from "@/app/actions/auth";
import Link from "next/link";

export default function CadastroPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      setLoading(false);
      return;
    }

    const result = await register(name, email, password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            Criar Conta
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-2"
              >
                Nome
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
              >
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
