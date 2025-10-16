"use client";

import { StudentFormData } from "@/types/student";

interface SectionProps {
  data: Partial<StudentFormData>;
  onUpdate: (data: Partial<StudentFormData>) => void;
}

export default function Section6ComunicacaoSocializacao({
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
          Linguagem Expressiva
        </label>
        <textarea
          name="linguagemExpressiva"
          value={data.linguagemExpressiva || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Como o aluno se expressa verbalmente? Vocabulário, fluência, clareza"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Linguagem Receptiva
        </label>
        <textarea
          name="linguagemReceptiva"
          value={data.linguagemReceptiva || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Compreende instruções? Entende perguntas e comandos?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Linguagem Pragmática (Uso Social)
        </label>
        <textarea
          name="linguagemPragmatica"
          value={data.linguagemPragmatica || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Usa a linguagem adequadamente em contextos sociais? Respeita turnos de fala?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Comunicação Não Verbal
        </label>
        <textarea
          name="comunicacaoNaoVerbal"
          value={data.comunicacaoNaoVerbal || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Usa gestos, expressões faciais, contato visual?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Literalidade e Compreensão de Linguagem Figurada
        </label>
        <textarea
          name="literalidade"
          value={data.literalidade || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Compreende metáforas, sarcasmo, piadas? Tende a ser literal?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Motivação Social
        </label>
        <textarea
          name="motivacaoSocial"
          value={data.motivacaoSocial || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Busca interação com outros? Prefere ficar sozinho?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Relações com Pares
        </label>
        <textarea
          name="relacoesPares"
          value={data.relacoesPares || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Tem amigos? Como se relaciona com outras crianças?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Teoria da Mente
        </label>
        <textarea
          name="teoriaMente"
          value={data.teoriaMente || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Compreende que outras pessoas têm pensamentos e sentimentos diferentes dos seus?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Comportamento em Grupo
        </label>
        <textarea
          name="comportamentoGrupo"
          value={data.comportamentoGrupo || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Como se comporta em atividades de grupo? Coopera, lidera, observa?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>
    </div>
  );
}
