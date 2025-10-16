"use client";

import { StudentFormData } from "@/types/student";
import { useState } from "react";

interface SectionProps {
  data: Partial<StudentFormData>;
  onUpdate: (data: Partial<StudentFormData>) => void;
}

export default function Section3HistoricoSaude({
  data,
  onUpdate,
}: SectionProps) {
  const [novoDiagnostico, setNovoDiagnostico] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    onUpdate({ [e.target.name]: e.target.value });
  };

  const handleAddDiagnostico = () => {
    if (novoDiagnostico.trim()) {
      const diagnosticos = data.diagnosticos || [];
      onUpdate({ diagnosticos: [...diagnosticos, novoDiagnostico.trim()] });
      setNovoDiagnostico("");
    }
  };

  const handleRemoveDiagnostico = (index: number) => {
    const diagnosticos = data.diagnosticos || [];
    onUpdate({
      diagnosticos: diagnosticos.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Motivo Principal da Busca por Apoio
        </label>
        <textarea
          name="motivoPrincipal"
          value={data.motivoPrincipal || ""}
          onChange={handleChange}
          rows={4}
          placeholder="Descreva o principal motivo que levou à busca de apoio educacional"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Diagnósticos (se houver)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={novoDiagnostico}
            onChange={(e) => setNovoDiagnostico(e.target.value)}
            placeholder="Ex: TEA, TDAH, Dislexia..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
          />
          <button
            type="button"
            onClick={handleAddDiagnostico}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Adicionar
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(data.diagnosticos || []).map((diag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-sm"
            >
              {diag}
              <button
                type="button"
                onClick={() => handleRemoveDiagnostico(index)}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Terapias e Acompanhamentos
        </label>
        <textarea
          name="terapias"
          value={data.terapias || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Descreva terapias atuais ou passadas (fonoaudiologia, terapia ocupacional, psicologia, etc.)"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Marcos do Desenvolvimento
        </label>
        <textarea
          name="marcosDesenvolvimento"
          value={data.marcosDesenvolvimento || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Informações sobre desenvolvimento motor, linguagem, socialização, etc."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Condições Médicas
        </label>
        <textarea
          name="condicoesMedicas"
          value={data.condicoesMedicas || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Alergias, medicações, condições crônicas, etc."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Histórico Familiar de Condições Similares
        </label>
        <select
          name="historicoFamiliar"
          value={data.historicoFamiliar || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        >
          <option value="">Selecione</option>
          <option value="sim">Sim</option>
          <option value="nao">Não</option>
          <option value="nao_sei">Não sei</option>
        </select>
      </div>
    </div>
  );
}
