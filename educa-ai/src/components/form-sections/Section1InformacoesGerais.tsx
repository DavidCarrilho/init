"use client";

import { StudentFormData } from "@/types/student";

interface SectionProps {
  data: Partial<StudentFormData>;
  onUpdate: (data: Partial<StudentFormData>) => void;
}

export default function Section1InformacoesGerais({
  data,
  onUpdate,
}: SectionProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onUpdate({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Nome Completo *
        </label>
        <input
          type="text"
          name="nomeCompleto"
          required
          value={data.nomeCompleto || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Data de Nascimento *
        </label>
        <input
          type="date"
          name="dataNascimento"
          required
          value={data.dataNascimento || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Idade *</label>
        <input
          type="text"
          name="idade"
          required
          value={data.idade || ""}
          onChange={handleChange}
          placeholder="Ex: 8 anos"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Ano Escolar *
        </label>
        <input
          type="text"
          name="anoEscolar"
          required
          value={data.anoEscolar || ""}
          onChange={handleChange}
          placeholder="Ex: 3º ano do Ensino Fundamental"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Responsável pelo Preenchimento *
        </label>
        <textarea
          name="responsavelPreenchimento"
          required
          value={data.responsavelPreenchimento || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Nome e relação com o aluno"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>
    </div>
  );
}
