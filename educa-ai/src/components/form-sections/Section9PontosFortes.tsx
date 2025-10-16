"use client";

import { StudentFormData } from "@/types/student";

interface SectionProps {
  data: Partial<StudentFormData>;
  onUpdate: (data: Partial<StudentFormData>) => void;
}

export default function Section9PontosFortes({ data, onUpdate }: SectionProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Nesta seção, vamos focar nos pontos fortes e nas coisas que o aluno
        gosta e faz bem!
      </p>

      <div>
        <label className="block text-sm font-medium mb-2">
          Hiperfocos e Interesses Especiais
        </label>
        <textarea
          name="hiperfocos"
          value={data.hiperfocos || ""}
          onChange={handleChange}
          rows={4}
          placeholder="Ex: Temas, atividades ou assuntos pelos quais o aluno demonstra grande interesse ou conhecimento aprofundado"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Superpoderes (Talentos e Habilidades)
        </label>
        <textarea
          name="superpoderes"
          value={data.superpoderes || ""}
          onChange={handleChange}
          rows={4}
          placeholder="Ex: Memória excepcional, habilidade artística, atenção a detalhes, raciocínio lógico, criatividade..."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Sistema de Recompensa
        </label>
        <textarea
          name="sistemaRecompensa"
          value={data.sistemaRecompensa || ""}
          onChange={handleChange}
          rows={4}
          placeholder="Ex: O que motiva o aluno? Recompensas que funcionam bem (elogios, tempo livre, atividades específicas, etc.)"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>
    </div>
  );
}
