"use client";

import { StudentFormData } from "@/types/student";

interface SectionProps {
  data: Partial<StudentFormData>;
  onUpdate: (data: Partial<StudentFormData>) => void;
}

export default function Section2ContextoFamiliar({
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
          Arranjo de Moradia
        </label>
        <textarea
          name="arranjoMoradia"
          value={data.arranjoMoradia || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Com quem o aluno mora? Descreva a composição familiar"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Relacionamento com os Pais
        </label>
        <textarea
          name="relacionamentoPais"
          value={data.relacionamentoPais || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Como é o relacionamento do aluno com os pais?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Relacionamento com a Mãe
        </label>
        <textarea
          name="relacionamentoMae"
          value={data.relacionamentoMae || ""}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Relacionamento com o Pai
        </label>
        <textarea
          name="relacionamentoPai"
          value={data.relacionamentoPai || ""}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Relacionamento com Irmãos
        </label>
        <textarea
          name="relacionamentoIrmaos"
          value={data.relacionamentoIrmaos || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Caso tenha irmãos, como é o relacionamento?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Relacionamento com Família Estendida
        </label>
        <textarea
          name="relacionamentoFamilia"
          value={data.relacionamentoFamilia || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Avós, tios, primos, etc."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>
    </div>
  );
}
