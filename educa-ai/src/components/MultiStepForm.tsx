"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StudentFormData } from "@/types/student";
import Section1InformacoesGerais from "./form-sections/Section1InformacoesGerais";
import Section2ContextoFamiliar from "./form-sections/Section2ContextoFamiliar";
import Section3HistoricoSaude from "./form-sections/Section3HistoricoSaude";
import Section4PerfilSensorial from "./form-sections/Section4PerfilSensorial";
import Section5FuncoesExecutivas from "./form-sections/Section5FuncoesExecutivas";
import Section6ComunicacaoSocializacao from "./form-sections/Section6ComunicacaoSocializacao";
import Section7PerfilComportamental from "./form-sections/Section7PerfilComportamental";
import Section8HabilidadesMotoras from "./form-sections/Section8HabilidadesMotoras";
import Section9PontosFortes from "./form-sections/Section9PontosFortes";
import Section10Objetivos from "./form-sections/Section10Objetivos";

interface MultiStepFormProps {
  initialData?: Partial<StudentFormData>;
  studentId?: string;
}

const sections = [
  { title: "Informações Gerais", component: Section1InformacoesGerais },
  { title: "Contexto Familiar e Social", component: Section2ContextoFamiliar },
  { title: "Histórico de Saúde", component: Section3HistoricoSaude },
  { title: "Perfil Sensorial", component: Section4PerfilSensorial },
  { title: "Funções Executivas", component: Section5FuncoesExecutivas },
  {
    title: "Comunicação e Socialização",
    component: Section6ComunicacaoSocializacao,
  },
  { title: "Perfil Comportamental", component: Section7PerfilComportamental },
  { title: "Habilidades Motoras", component: Section8HabilidadesMotoras },
  { title: "Pontos Fortes", component: Section9PontosFortes },
  { title: "Objetivos", component: Section10Objetivos },
];

export default function MultiStepForm({
  initialData,
  studentId: initialStudentId,
}: MultiStepFormProps) {
  const router = useRouter();
  // Inicializar com a seção salva anteriormente, se existir
  const initialStep = initialData?.secaoAtual ? (initialData.secaoAtual as number) - 1 : 0;
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState<Partial<StudentFormData>>(
    initialData || {}
  );
  const [saving, setSaving] = useState(false);
  // Manter o studentId no estado do componente
  const [studentId, setStudentId] = useState<string | undefined>(initialStudentId);

  const CurrentSection = sections[currentStep].component;

  const calculateProgress = () => {
    return Math.round(((currentStep + 1) / sections.length) * 100);
  };

  const handleNext = async () => {
    // Salvar progresso automaticamente
    await saveProgress();

    if (currentStep < sections.length - 1) {
      setCurrentStep(currentStep + 1);
      // Rolar suavemente para o início do formulário
      setTimeout(() => {
        window.scrollTo({ top: 200, behavior: "smooth" });
      }, 50);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Rolar suavemente para o início do formulário
      setTimeout(() => {
        window.scrollTo({ top: 200, behavior: "smooth" });
      }, 50);
    }
  };

  const handleUpdateData = (data: Partial<StudentFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const saveProgress = async () => {
    setSaving(true);
    try {
      const progress = calculateProgress();
      const dataToSave = {
        ...formData,
        progressoFormulario: progress,
        secaoAtual: currentStep + 1,
        concluido: currentStep === sections.length - 1,
      };

      const url = studentId ? `/api/students/${studentId}` : "/api/students";
      const method = studentId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar");
      }

      const savedStudent = await response.json();

      // Se for um novo aluno, atualizar o studentId no estado e mudar a URL sem reload
      if (!studentId && savedStudent.id) {
        setStudentId(savedStudent.id);
        // Mudar a URL sem causar navegação/reload
        window.history.replaceState(null, "", `/alunos/${savedStudent.id}`);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar o progresso");
    } finally {
      setSaving(false);
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      const dataToSave = {
        ...formData,
        progressoFormulario: 100,
        secaoAtual: 10,
        concluido: true,
      };

      const url = studentId ? `/api/students/${studentId}` : "/api/students";
      const method = studentId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        throw new Error("Erro ao finalizar");
      }

      alert("Perfil do aluno concluído com sucesso!");
      router.push("/alunos");
    } catch (error) {
      console.error("Erro ao finalizar:", error);
      alert("Erro ao finalizar o perfil");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Seção {currentStep + 1} de {sections.length}
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {calculateProgress()}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${calculateProgress()}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-2">
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentStep(index);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                index === currentStep
                  ? "bg-blue-600 text-white"
                  : index < currentStep
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              {index + 1}. {section.title}
            </button>
          ))}
        </div>
      </div>

      {/* Current Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6">
          {sections[currentStep].title}
        </h2>
        <CurrentSection data={formData} onUpdate={handleUpdateData} />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-600 rounded-lg font-medium transition-colors"
        >
          Anterior
        </button>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          {saving && "Salvando..."}
        </div>

        {currentStep === sections.length - 1 ? (
          <button
            onClick={handleFinish}
            disabled={saving}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors"
          >
            {saving ? "Finalizando..." : "Finalizar Perfil"}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
          >
            {saving ? "Salvando..." : "Próxima"}
          </button>
        )}
      </div>
    </div>
  );
}
