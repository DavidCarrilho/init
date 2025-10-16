"use client";

import { StudentFormData } from "@/types/student";

interface SectionProps {
  data: Partial<StudentFormData>;
  onUpdate: (data: Partial<StudentFormData>) => void;
}

export default function Section8HabilidadesMotoras({
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
          Motricidade Fina
        </label>
        <textarea
          name="motricidadeFina"
          value={data.motricidadeFina || ""}
          onChange={handleChange}
          rows={4}
          placeholder="Ex: Consegue escrever, desenhar, recortar, abotoar? Como é a coordenação das mãos?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Motricidade Grossa
        </label>
        <textarea
          name="motricidadeGrossa"
          value={data.motricidadeGrossa || ""}
          onChange={handleChange}
          rows={4}
          placeholder="Ex: Consegue correr, pular, subir escadas, andar de bicicleta? Como é a coordenação corporal geral?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>
    </div>
  );
}
