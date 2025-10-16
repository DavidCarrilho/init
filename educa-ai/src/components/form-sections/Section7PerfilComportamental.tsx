"use client";

import { StudentFormData } from "@/types/student";

interface SectionProps {
  data: Partial<StudentFormData>;
  onUpdate: (data: Partial<StudentFormData>) => void;
}

export default function Section7PerfilComportamental({
  data,
  onUpdate,
}: SectionProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Regulação Emocional
        </label>
        <textarea
          name="regulacaoEmocional"
          value={data.regulacaoEmocional || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Como lida com frustração, raiva, alegria? Consegue se acalmar?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Gatilhos Comportamentais
        </label>
        <textarea
          name="gatilhosComportamentais"
          value={data.gatilhosComportamentais || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Situações ou estímulos que causam comportamentos desafiadores"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Comportamentos Repetitivos ou Estereotipados
        </label>
        <textarea
          name="comportamentosRepetitivos"
          value={data.comportamentosRepetitivos || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Movimentos repetitivos, rituais, necessidade de sameness"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Reação a Limites e Regras
        </label>
        <textarea
          name="reacaoLimites"
          value={data.reacaoLimites || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Como reage quando recebe um 'não'? Aceita regras e limites?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Resiliência</label>
        <textarea
          name="resiliencia"
          value={data.resiliencia || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Como lida com fracassos ou desafios? Persiste ou desiste facilmente?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>
    </div>
  );
}
