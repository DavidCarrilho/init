"use client";

import { StudentFormData } from "@/types/student";

interface SectionProps {
  data: Partial<StudentFormData>;
  onUpdate: (data: Partial<StudentFormData>) => void;
}

export default function Section4PerfilSensorial({
  data,
  onUpdate,
}: SectionProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Descreva como o aluno reage a diferentes estímulos sensoriais. Se
        possível, indique se há hiper ou hipossensibilidade.
      </p>

      <div>
        <label className="block text-sm font-medium mb-2">
          Audição (Sons, Ruídos)
        </label>
        <textarea
          name="perfilAudicao"
          value={data.perfilAudicao || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Incomoda-se com barulhos altos, gosta de música, etc."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Visão (Luzes, Cores, Movimento)
        </label>
        <textarea
          name="perfilVisao"
          value={data.perfilVisao || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Incomoda-se com luzes fortes, atrai-se por padrões visuais, etc."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Tato (Texturas, Temperatura, Toque)
        </label>
        <textarea
          name="perfilTato"
          value={data.perfilTato || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Evita certas texturas, gosta de tocar objetos macios, etc."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Paladar e Olfato
        </label>
        <textarea
          name="perfilPaladarOlfato"
          value={data.perfilPaladarOlfato || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Seletividade alimentar, reações a cheiros fortes, etc."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Sistema Vestibular (Equilíbrio, Movimento)
        </label>
        <textarea
          name="perfilVestibular"
          value={data.perfilVestibular || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Gosta de girar, balançar, tem dificuldade com equilíbrio, etc."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Propriocepção (Consciência Corporal)
        </label>
        <textarea
          name="perfilPropriocepcao"
          value={data.perfilPropriocepcao || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Dificuldade em saber onde está o corpo no espaço, gosta de pressão profunda, etc."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Interocepção (Sensações Internas)
        </label>
        <textarea
          name="perfilInterocepcao"
          value={data.perfilInterocepcao || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Dificuldade em reconhecer fome, sede, necessidade de ir ao banheiro, etc."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>
    </div>
  );
}
