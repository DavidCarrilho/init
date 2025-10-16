"use client";

import { StudentFormData } from "@/types/student";
import { useState } from "react";

interface SectionProps {
  data: Partial<StudentFormData>;
  onUpdate: (data: Partial<StudentFormData>) => void;
}

export default function Section10Objetivos({ data, onUpdate }: SectionProps) {
  const [novoObjetivo, setNovoObjetivo] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ [e.target.name]: e.target.value });
  };

  const handleAddObjetivo = () => {
    if (novoObjetivo.trim()) {
      const objetivos = data.objetivos || [];
      if (objetivos.length < 3) {
        onUpdate({ objetivos: [...objetivos, novoObjetivo.trim()] });
        setNovoObjetivo("");
      } else {
        alert("Você pode adicionar no máximo 3 objetivos");
      }
    }
  };

  const handleRemoveObjetivo = (index: number) => {
    const objetivos = data.objetivos || [];
    onUpdate({
      objetivos: objetivos.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Objetivos Principais (até 3)
        </label>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Quais são os principais objetivos que você gostaria de alcançar com
          este aluno?
        </p>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={novoObjetivo}
            onChange={(e) => setNovoObjetivo(e.target.value)}
            placeholder="Digite um objetivo"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
          />
          <button
            type="button"
            onClick={handleAddObjetivo}
            disabled={(data.objetivos || []).length >= 3}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg"
          >
            Adicionar
          </button>
        </div>
        <div className="space-y-2">
          {(data.objetivos || []).map((objetivo, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-sm font-medium">
                {index + 1}
              </span>
              <span className="flex-1">{objetivo}</span>
              <button
                type="button"
                onClick={() => handleRemoveObjetivo(index)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {(data.objetivos || []).length}/3 objetivos adicionados
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Informações Adicionais
        </label>
        <textarea
          name="informacoesAdicionais"
          value={data.informacoesAdicionais || ""}
          onChange={handleChange}
          rows={5}
          placeholder="Qualquer outra informação que você considere relevante sobre o aluno"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.possuiLaudo || false}
            onChange={(e) => onUpdate({ possuiLaudo: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium">Possui laudo médico</span>
        </label>
      </div>

      {data.possuiLaudo && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Informações do Laudo
          </label>
          <textarea
            name="laudoTexto"
            value={data.laudoTexto || ""}
            onChange={handleChange}
            rows={5}
            placeholder="Descreva as informações principais do laudo médico"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
          />
        </div>
      )}
    </div>
  );
}
