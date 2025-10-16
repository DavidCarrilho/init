"use server";

import { signIn, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

export async function login(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
    return { success: true };
  } catch (error) {
    // Re-lançar erros de redirecionamento do Next.js
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email ou senha inválidos" };
        default:
          return { error: "Algo deu errado. Tente novamente." };
      }
    }
    throw error;
  }
}

export async function register(name: string, email: string, password: string) {
  try {
    // Verificar se o usuário já existe
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return { error: "Email já está em uso" };
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Criar usuário
    await db.insert(users).values({
      name,
      email,
      passwordHash,
    });

    // Fazer login automático
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });

    return { success: true };
  } catch (error) {
    // Re-lançar erros de redirecionamento do Next.js
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Erro no registro:", error);
    return { error: "Erro ao criar conta. Tente novamente." };
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
