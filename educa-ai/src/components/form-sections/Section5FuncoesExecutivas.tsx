"use client";

import { StudentFormData } from "@/types/student";

interface SectionProps {
  data: Partial<StudentFormData>;
  onUpdate: (data: Partial<StudentFormData>) => void;
}

export default function Section5FuncoesExecutivas({
  data,
  onUpdate,
}: SectionProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Descreva como o aluno se comporta em relação às funções executivas.
      </p>

      <div>
        <label className="block text-sm font-medium mb-2">
          Iniciação de Tarefa
        </label>
        <textarea
          name="iniciacaoTarefa"
          value={data.iniciacaoTarefa || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Consegue começar atividades sozinho ou precisa de estímulo?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Atenção Sustentada
        </label>
        <textarea
          name="atencaoSustentada"
          value={data.atencaoSustentada || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Consegue manter foco por quanto tempo? Distrai-se facilmente?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Planejamento e Sequenciamento
        </label>
        <textarea
          name="planejamentoSequenciamento"
          value={data.planejamentoSequenciamento || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Consegue planejar etapas de uma atividade? Entende sequências?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Organização</label>
        <textarea
          name="organizacao"
          value={data.organizacao || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Mantém materiais organizados? Segue rotinas?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Memória de Trabalho
        </label>
        <textarea
          name="memoriaTrabalho"
          value={data.memoriaTrabalho || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Consegue lembrar de instruções? Retém informações temporariamente?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Controle de Impulsos
        </label>
        <textarea
          name="controleImpulsos"
          value={data.controleImpulsos || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Age antes de pensar? Consegue esperar sua vez?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Flexibilidade Cognitiva
        </label>
        <textarea
          name="flexibilidadeCognitiva"
          value={data.flexibilidadeCognitiva || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Adapta-se a mudanças? Lida bem com imprevistos?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Automonitoria</label>
        <textarea
          name="automonitoria"
          value={data.automonitoria || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Percebe quando comete erros? Avalia seu próprio desempenho?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Velocidade de Processamento
        </label>
        <textarea
          name="velocidadeProcessamento"
          value={data.velocidadeProcessamento || ""}
          onChange={handleChange}
          rows={3}
          placeholder="Ex: Demora para processar informações? Precisa de mais tempo?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>
    </div>
  );
}
