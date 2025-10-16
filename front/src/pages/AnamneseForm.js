import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { studentAPI } from '../services/api';
import ComingSoon from '../components/ComingSoon';
import { 
  ArrowBack, 
  ArrowForward, 
  Check,
  Home as HomeIcon,
  Download,
  Delete,
  CloudUpload
} from '@mui/icons-material';

const AnamneseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Para edição
  const { user } = useAuth();
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({
    // Seção 1: Informações Gerais
    nomeCompleto: '',
    dataNascimento: '',
    idade: '',
    anoEscolar: '',
    responsavelPreenchimento: '',
    
    // Seção 2: Contexto Familiar
    arranjoMoradia: '',
    relacionamentoPais: '',
    relacionamentoMae: '',
    relacionamentoPai: '',
    relacionamentoIrmaos: '',
    relacionamentoFamilia: '',
    
    // Seção 3: Histórico de Saúde
    motivoPrincipal: '',
    diagnosticos: [],
    terapias: '',
    marcosDesenvolvimento: '',
    condicoesMedicas: '',
    historicoFamiliar: '',
    
    // Seção 4: Perfil Sensorial
    perfilAudicao: '',
    perfilVisao: '',
    perfilTato: '',
    perfilPaladarOlfato: '',
    perfilVestibular: '',
    perfilPropriocepcao: '',
    perfilInterocepcao: '',
    
    // Seção 5: Funções Executivas
    iniciacaoTarefa: '',
    atencaoSustentada: '',
    planejamentoSequenciamento: '',
    organizacao: '',
    memoriaTrabalho: '',
    controleImpulsos: '',
    flexibilidadeCognitiva: '',
    automonitoria: '',
    velocidadeProcessamento: '',
    
    // Seção 6: Comunicação
    linguagemExpressiva: '',
    linguagemReceptiva: '',
    linguagemPragmatica: '',
    comunicacaoNaoVerbal: '',
    literalidade: '',
    motivacaoSocial: '',
    relacoesPares: '',
    teoriaMente: '',
    comportamentoGrupo: '',
    
    // Seção 7: Comportamental
    regulacaoEmocional: '',
    gatilhosComportamentais: '',
    comportamentosRepetitivos: '',
    reacaoLimites: '',
    resiliencia: '',
    
    // Seção 8: Habilidades Motoras
    motricidadeFina: '',
    motricidadeGrossa: '',
    
    // Seção 9: Pontos Fortes
    hiperfocos: '',
    superpoderes: '',
    sistemaRecompensa: '',
    
    // Seção 10: Objetivos
    objetivos: ['', '', ''],
    informacoesAdicionais: '',
    
    // Laudo Médico (Opcional)
    possuiLaudo: false,
    laudoTexto: '',
    laudoArquivo: null,
    laudoTipoArquivo: '',
    laudoNomeOriginal: ''
  });

  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLaudoSection, setShowLaudoSection] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const totalSections = 10;
  const diagnosticoOptions = [
    'Transtorno do Espectro Autista (TEA)',
    'Transtorno de Déficit de Atenção e Hiperatividade (TDAH)',
    'Transtorno Opositor Desafiador (TOD)',
    'Síndrome de Down',
    'Dislexia / Discalculia / Disgrafia',
    'Transtornos de Ansiedade / Humor',
    'Transtorno de Processamento Sensorial (TPS)',
    'Altas Habilidades / Superdotação',
    'Outro',
    'Nenhum diagnóstico formal'
  ];

  // Carregar dados do estudante se for edição
  useEffect(() => {
    if (id) {
      fetchStudent();
    }
  }, [id]);

  // Calcular progresso
  useEffect(() => {
    calculateProgress();
  }, [formData, currentSection]);

  const fetchStudent = async () => {
    try {
      const data = await studentAPI.getStudent(id);
      setFormData(data.student);
      setCurrentSection(data.student.secaoAtual || 1);
      setIsCompleted(data.student.concluido || false);

      // Se o estudante está concluído e na última seção, mostrar seção de laudo
      if (data.student.concluido && data.student.secaoAtual === 10) {
        setShowLaudoSection(true);
      }
    } catch (error) {
      console.error('Erro ao buscar estudante:', error);
    }
  };

  const calculateProgress = () => {
    // Definir campos obrigatórios para o cálculo de progresso
    const requiredFields = [
      'nomeCompleto', 'dataNascimento', 'idade', 'anoEscolar', 'responsavelPreenchimento',
      'arranjoMoradia', 'relacionamentoPais', 'relacionamentoMae', 'relacionamentoPai', 
      'relacionamentoIrmaos', 'relacionamentoFamilia',
      'motivoPrincipal', 'terapias', 'marcosDesenvolvimento', 'condicoesMedicas', 'historicoFamiliar',
      'perfilAudicao', 'perfilVisao', 'perfilTato', 'perfilPaladarOlfato', 'perfilVestibular', 
      'perfilPropriocepcao', 'perfilInterocepcao',
      'iniciacaoTarefa', 'atencaoSustentada', 'planejamentoSequenciamento', 'organizacao', 
      'memoriaTrabalho', 'controleImpulsos', 'flexibilidadeCognitiva', 'automonitoria', 'velocidadeProcessamento',
      'linguagemExpressiva', 'linguagemReceptiva', 'linguagemPragmatica', 'comunicacaoNaoVerbal', 
      'literalidade', 'motivacaoSocial', 'relacoesPares', 'teoriaMente', 'comportamentoGrupo',
      'regulacaoEmocional', 'gatilhosComportamentais', 'comportamentosRepetitivos', 'reacaoLimites', 'resiliencia',
      'motricidadeFina', 'motricidadeGrossa',
      'hiperfocos', 'superpoderes', 'sistemaRecompensa',
      'informacoesAdicionais'
    ];

    let filledCount = 0;

    // Verificar campos de texto simples
    requiredFields.forEach(field => {
      if (formData[field] && formData[field].toString().trim() !== '') {
        filledCount++;
      }
    });

    // Verificar diagnósticos (array)
    if (formData.diagnosticos && formData.diagnosticos.length > 0) {
      filledCount++;
    }

    // Verificar objetivos (pelo menos um preenchido)
    if (formData.objetivos && formData.objetivos.some(obj => obj && obj.trim() !== '')) {
      filledCount++;
    }

    const totalRequiredFields = requiredFields.length + 2; // +2 para diagnósticos e objetivos
    const progressPercent = Math.min(100, Math.round((filledCount / totalRequiredFields) * 100));
    setProgress(progressPercent);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateMaskChange = (field, value) => {
    // Remover todos os caracteres que não são dígitos
    let digits = value.replace(/\D/g, '');

    // Limitar a 8 dígitos (DDMMAAAA)
    if (digits.length > 8) {
      digits = digits.substring(0, 8);
    }

    // Aplicar a máscara DD/MM/AAAA
    let maskedValue = '';

    if (digits.length >= 1) {
      maskedValue = digits.substring(0, 2);
    }
    if (digits.length >= 3) {
      maskedValue += '/' + digits.substring(2, 4);
    }
    if (digits.length >= 5) {
      maskedValue += '/' + digits.substring(4, 8);
    }

    // Validar data se estiver completa
    if (digits.length === 8) {
      const day = parseInt(digits.substring(0, 2));
      const month = parseInt(digits.substring(2, 4));
      const year = parseInt(digits.substring(4, 8));

      // Validar limites básicos
      if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear() + 1) {
        return; // Não aceitar data inválida
      }

      // Validar se a data existe (ex: 31/02 não existe)
      const date = new Date(year, month - 1, day);
      if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
        return; // Data não existe
      }
    }

    setFormData(prev => ({
      ...prev,
      [field]: maskedValue
    }));
  };

  const handleDiagnosticoChange = (diagnostico) => {
    setFormData(prev => ({
      ...prev,
      diagnosticos: prev.diagnosticos.includes(diagnostico)
        ? prev.diagnosticos.filter(d => d !== diagnostico)
        : [...prev.diagnosticos, diagnostico]
    }));
  };

  const handleObjetivoChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      objetivos: prev.objetivos.map((obj, i) => i === index ? value : obj)
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Verificar tamanho (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo permitido: 10MB');
        return;
      }
      
      // Verificar tipo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Tipo de arquivo não permitido. Use apenas JPG, PNG ou PDF.');
        return;
      }
      
      setSelectedFile(file);
      setFormData(prev => ({
        ...prev,
        possuiLaudo: true,
        laudoArquivo: file,
        laudoNomeOriginal: file.name,
        laudoTipoArquivo: file.type
      }));
    }
  };

  const saveProgress = async () => {
    setLoading(true);
    try {
      const studentData = {
        ...formData,
        secaoAtual: currentSection,
        progressoFormulario: progress
      };

      let data;
      if (id) {
        // Atualizar estudante existente
        data = await studentAPI.updateStudent(id, studentData);
      } else {
        // Criar novo estudante
        data = await studentAPI.createStudent(studentData);
      }

      if (!id && data.student) {
        // Novo estudante criado, redirecionar para edição
        navigate(`/form/${data.student.id}`);
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadLaudo = async () => {
    if (!id) return false;
    
    try {
      const uploadFormData = new FormData();
      
      // Adicionar texto do laudo se houver
      if (formData.laudoTexto) {
        uploadFormData.append('laudoTexto', formData.laudoTexto);
      }
      
      // Adicionar arquivo se houver
      if (formData.laudoArquivo) {
        uploadFormData.append('laudoFile', formData.laudoArquivo);
      }
      
      const response = await studentAPI.uploadLaudo(id, uploadFormData);
      
      if (response.success) {
        console.log('✅ Laudo enviado com sucesso');
        
        // Atualizar estado local com dados retornados do servidor
        if (response.student) {
          setFormData(prev => ({
            ...prev,
            possuiLaudo: response.student.possuiLaudo,
            laudoTexto: response.student.laudoTexto || prev.laudoTexto,
            laudoArquivo: response.student.laudoArquivo || prev.laudoArquivo,
            laudoTipoArquivo: response.student.laudoTipoArquivo || prev.laudoTipoArquivo,
            laudoNomeOriginal: response.student.laudoNomeOriginal || prev.laudoNomeOriginal,
            laudoUrl: response.student.laudoUrl || prev.laudoUrl
          }));
        }
        
        return true;
      } else {
        throw new Error(response.message || 'Erro ao enviar laudo');
      }
    } catch (error) {
      console.error('❌ Erro ao fazer upload do laudo:', error);
      alert(`Erro ao enviar laudo médico: ${error.message || 'Tente novamente.'}`);
      return false;
    }
  };

  // Função para download do laudo
  const downloadLaudo = async () => {
    if (!id) return;
    
    try {
      const response = await studentAPI.downloadLaudo(id);
      
      // Criar URL temporária para download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Obter nome do arquivo do header ou usar padrão
      const contentDisposition = response.headers['content-disposition'];
      let fileName = 'laudo-medico.pdf';
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch) {
          fileName = fileNameMatch[1];
        }
      }
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Download iniciado');
    } catch (error) {
      console.error('❌ Erro ao baixar laudo:', error);
      alert('Erro ao baixar laudo médico. Tente novamente.');
    }
  };

  // Função para remover o laudo
  const removeLaudo = async () => {
    if (!id) return;
    
    if (!window.confirm('Tem certeza que deseja remover o laudo médico? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      const response = await studentAPI.removeLaudo(id);
      
      if (response.success) {
        // Limpar dados do laudo no formulário
        setFormData(prev => ({
          ...prev,
          possuiLaudo: false,
          laudoTexto: '',
          laudoArquivo: null,
          laudoTipoArquivo: '',
          laudoNomeOriginal: '',
          laudoUrl: ''
        }));
        setSelectedFile(null);
        
        alert('Laudo médico removido com sucesso!');
        console.log('✅ Laudo removido');
      } else {
        throw new Error(response.message || 'Erro ao remover laudo');
      }
    } catch (error) {
      console.error('❌ Erro ao remover laudo:', error);
      alert(`Erro ao remover laudo médico: ${error.message || 'Tente novamente.'}`);
    }
  };

  const completeForm = async () => {
    // Validar seção atual antes de concluir
    const errors = validateCurrentSection();
    
    if (errors.length > 0) {
      alert(`Por favor, preencha todos os campos obrigatórios:\n\n${errors.map(e => `• ${e.message}`).join('\n')}`);
      scrollToFirstError(errors);
      return;
    }
    
    // Salvar progresso primeiro
    await saveProgress();
    
    // Se estamos na seção 10 e não mostrou a seção de laudo ainda
    if (currentSection === 10 && !showLaudoSection) {
      setShowLaudoSection(true);
      // Fazer scroll suave para baixo
      setTimeout(() => {
        window.scrollTo({ 
          top: document.body.scrollHeight, 
          behavior: 'smooth' 
        });
      }, 100);
      return;
    }
    
    // Se tem laudo para enviar, enviar primeiro (texto ou arquivo)
    if (formData.possuiLaudo && (formData.laudoTexto || formData.laudoArquivo)) {
      const laudoSent = await uploadLaudo();
      if (!laudoSent) return;
    }
    
    setIsCompleted(true);
    navigate('/home');
  };

  // Função para validar campos obrigatórios de uma seção
  const validateCurrentSection = () => {
    const errors = [];
    
    switch (currentSection) {
      case 1:
        if (!formData.nomeCompleto?.trim()) errors.push({ field: 'nomeCompleto', message: 'Nome completo é obrigatório' });
        // Validar data de nascimento considerando apenas os dígitos (desconsiderar as barras)
        const dataNascimentoDigits = formData.dataNascimento?.replace(/\D/g, '');
        if (!formData.dataNascimento?.trim() || dataNascimentoDigits?.length !== 8) {
          errors.push({ field: 'dataNascimento', message: 'Data de nascimento é obrigatória (formato: DD/MM/AAAA)' });
        }
        if (!formData.idade?.trim()) errors.push({ field: 'idade', message: 'Idade é obrigatória' });
        if (!formData.anoEscolar?.trim()) errors.push({ field: 'anoEscolar', message: 'Ano escolar é obrigatório' });
        if (!formData.responsavelPreenchimento?.trim()) errors.push({ field: 'responsavelPreenchimento', message: 'Responsável pelo preenchimento é obrigatório' });
        break;
        
      case 2:
        if (!formData.arranjoMoradia?.trim()) errors.push({ field: 'arranjoMoradia', message: 'Arranjo de moradia é obrigatório' });
        if (!formData.relacionamentoPais?.trim()) errors.push({ field: 'relacionamentoPais', message: 'Relacionamento dos pais é obrigatório' });
        if (!formData.relacionamentoMae?.trim()) errors.push({ field: 'relacionamentoMae', message: 'Relacionamento com a mãe é obrigatório' });
        if (!formData.relacionamentoPai?.trim()) errors.push({ field: 'relacionamentoPai', message: 'Relacionamento com o pai é obrigatório' });
        if (!formData.relacionamentoIrmaos?.trim()) errors.push({ field: 'relacionamentoIrmaos', message: 'Relacionamento com irmãos é obrigatório' });
        if (!formData.relacionamentoFamilia?.trim()) errors.push({ field: 'relacionamentoFamilia', message: 'Relacionamento familiar é obrigatório' });
        break;
        
      case 3:
        if (!formData.motivoPrincipal?.trim()) errors.push({ field: 'motivoPrincipal', message: 'Motivo principal é obrigatório' });
        if (!formData.diagnosticos || formData.diagnosticos.length === 0) errors.push({ field: 'diagnosticos', message: 'Pelo menos um diagnóstico deve ser selecionado' });
        if (!formData.terapias?.trim()) errors.push({ field: 'terapias', message: 'Informação sobre terapias é obrigatória' });
        if (!formData.marcosDesenvolvimento?.trim()) errors.push({ field: 'marcosDesenvolvimento', message: 'Marcos do desenvolvimento são obrigatórios' });
        if (!formData.condicoesMedicas?.trim()) errors.push({ field: 'condicoesMedicas', message: 'Condições médicas são obrigatórias' });
        if (!formData.historicoFamiliar?.trim()) errors.push({ field: 'historicoFamiliar', message: 'Histórico familiar é obrigatório' });
        break;
        
      case 4:
        if (!formData.perfilAudicao?.trim()) errors.push({ field: 'perfilAudicao', message: 'Perfil auditivo é obrigatório' });
        if (!formData.perfilVisao?.trim()) errors.push({ field: 'perfilVisao', message: 'Perfil visual é obrigatório' });
        if (!formData.perfilTato?.trim()) errors.push({ field: 'perfilTato', message: 'Perfil tátil é obrigatório' });
        if (!formData.perfilPaladarOlfato?.trim()) errors.push({ field: 'perfilPaladarOlfato', message: 'Perfil paladar/olfato é obrigatório' });
        if (!formData.perfilVestibular?.trim()) errors.push({ field: 'perfilVestibular', message: 'Perfil vestibular é obrigatório' });
        if (!formData.perfilPropriocepcao?.trim()) errors.push({ field: 'perfilPropriocepcao', message: 'Perfil proprioceptivo é obrigatório' });
        if (!formData.perfilInterocepcao?.trim()) errors.push({ field: 'perfilInterocepcao', message: 'Perfil interoceptivo é obrigatório' });
        break;
        
      case 5:
        if (!formData.iniciacaoTarefa?.trim()) errors.push({ field: 'iniciacaoTarefa', message: 'Iniciação de tarefa é obrigatória' });
        if (!formData.atencaoSustentada?.trim()) errors.push({ field: 'atencaoSustentada', message: 'Atenção sustentada é obrigatória' });
        if (!formData.planejamentoSequenciamento?.trim()) errors.push({ field: 'planejamentoSequenciamento', message: 'Planejamento é obrigatório' });
        if (!formData.organizacao?.trim()) errors.push({ field: 'organizacao', message: 'Organização é obrigatória' });
        if (!formData.memoriaTrabalho?.trim()) errors.push({ field: 'memoriaTrabalho', message: 'Memória de trabalho é obrigatória' });
        if (!formData.controleImpulsos?.trim()) errors.push({ field: 'controleImpulsos', message: 'Controle de impulsos é obrigatório' });
        if (!formData.flexibilidadeCognitiva?.trim()) errors.push({ field: 'flexibilidadeCognitiva', message: 'Flexibilidade cognitiva é obrigatória' });
        if (!formData.automonitoria?.trim()) errors.push({ field: 'automonitoria', message: 'Automonitoração é obrigatória' });
        if (!formData.velocidadeProcessamento?.trim()) errors.push({ field: 'velocidadeProcessamento', message: 'Velocidade de processamento é obrigatória' });
        break;
        
      case 6:
        if (!formData.linguagemExpressiva?.trim()) errors.push({ field: 'linguagemExpressiva', message: 'Linguagem expressiva é obrigatória' });
        if (!formData.linguagemReceptiva?.trim()) errors.push({ field: 'linguagemReceptiva', message: 'Linguagem receptiva é obrigatória' });
        if (!formData.linguagemPragmatica?.trim()) errors.push({ field: 'linguagemPragmatica', message: 'Linguagem pragmática é obrigatória' });
        if (!formData.comunicacaoNaoVerbal?.trim()) errors.push({ field: 'comunicacaoNaoVerbal', message: 'Comunicação não-verbal é obrigatória' });
        if (!formData.literalidade?.trim()) errors.push({ field: 'literalidade', message: 'Literalidade é obrigatória' });
        if (!formData.motivacaoSocial?.trim()) errors.push({ field: 'motivacaoSocial', message: 'Motivação social é obrigatória' });
        if (!formData.relacoesPares?.trim()) errors.push({ field: 'relacoesPares', message: 'Relações com pares é obrigatório' });
        if (!formData.teoriaMente?.trim()) errors.push({ field: 'teoriaMente', message: 'Teoria da mente é obrigatória' });
        if (!formData.comportamentoGrupo?.trim()) errors.push({ field: 'comportamentoGrupo', message: 'Comportamento em grupo é obrigatório' });
        break;
        
      case 7:
        if (!formData.regulacaoEmocional?.trim()) errors.push({ field: 'regulacaoEmocional', message: 'Regulação emocional é obrigatória' });
        if (!formData.gatilhosComportamentais?.trim()) errors.push({ field: 'gatilhosComportamentais', message: 'Gatilhos comportamentais são obrigatórios' });
        if (!formData.comportamentosRepetitivos?.trim()) errors.push({ field: 'comportamentosRepetitivos', message: 'Comportamentos repetitivos são obrigatórios' });
        if (!formData.reacaoLimites?.trim()) errors.push({ field: 'reacaoLimites', message: 'Reação a limites é obrigatória' });
        if (!formData.resiliencia?.trim()) errors.push({ field: 'resiliencia', message: 'Resiliência é obrigatória' });
        break;
        
      case 8:
        if (!formData.motricidadeFina?.trim()) errors.push({ field: 'motricidadeFina', message: 'Motricidade fina é obrigatória' });
        if (!formData.motricidadeGrossa?.trim()) errors.push({ field: 'motricidadeGrossa', message: 'Motricidade grossa é obrigatória' });
        break;
        
      case 9:
        if (!formData.hiperfocos?.trim()) errors.push({ field: 'hiperfocos', message: 'Hiperfocos são obrigatórios' });
        if (!formData.superpoderes?.trim()) errors.push({ field: 'superpoderes', message: 'Superpoderes são obrigatórios' });
        if (!formData.sistemaRecompensa?.trim()) errors.push({ field: 'sistemaRecompensa', message: 'Sistema de recompensa é obrigatório' });
        break;
        
      case 10:
        if (!formData.objetivos || !formData.objetivos.some(obj => obj && obj.trim() !== '')) {
          errors.push({ field: 'objetivos', message: 'Pelo menos um objetivo deve ser preenchido' });
        }
        if (!formData.informacoesAdicionais?.trim()) errors.push({ field: 'informacoesAdicionais', message: 'Informações adicionais são obrigatórias' });
        break;
        
      default:
        break;
    }
    
    return errors;
  };

  // Função para fazer scroll até o primeiro campo com erro
  const scrollToFirstError = (errors) => {
    if (errors.length > 0) {
      const firstErrorField = errors[0].field;
      
      // Tentar encontrar o elemento por diferentes seletores
      let element = document.querySelector(`[name="${firstErrorField}"]`);
      
      if (!element) {
        // Se não encontrar por name, buscar por value que contenha o valor do campo
        const inputs = document.querySelectorAll('input, textarea, select');
        for (let input of inputs) {
          if (input.value === formData[firstErrorField] || 
              (input.type === 'checkbox' && formData[firstErrorField]?.includes?.(input.value))) {
            element = input;
            break;
          }
        }
      }
      
      if (!element) {
        // Se ainda não encontrou, buscar pelo primeiro input/textarea/select na seção atual
        element = document.querySelector('.form-section input, .form-section textarea, .form-section select');
      }
      
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        element.focus();
      }
    }
  };

  const nextSection = () => {
    // Validar seção atual antes de avançar
    const errors = validateCurrentSection();
    
    if (errors.length > 0) {
      // Mostrar alerta com os erros
      alert(`Por favor, preencha todos os campos obrigatórios:\n\n${errors.map(e => `• ${e.message}`).join('\n')}`);
      
      // Fazer scroll para o primeiro campo com erro
      scrollToFirstError(errors);
      return;
    }
    
    // Salvar progresso automaticamente ao avançar
    saveProgress();
    
    if (currentSection < totalSections) {
      setCurrentSection(currentSection + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <div className="form-section">
            <h2>Passo 1: Informações Gerais</h2>
            <p className="section-description">
              Informações básicas sobre o aluno e responsável pelo preenchimento.
            </p>
            
            <div className="form-group">
              <label>Nome Completo do Aluno</label>
              <input
                type="text"
                name="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Data de Nascimento</label>
              <input
                type="text"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={(e) => handleDateMaskChange('dataNascimento', e.target.value)}
                className="form-input"
                placeholder="DD/MM/AAAA"
                maxLength="10"
                required
              />
            </div>

            <div className="form-group">
              <label>Idade (Anos e Meses)</label>
              <input
                type="text"
                name="idade"
                placeholder="Ex: 8 anos e 5 meses"
                value={formData.idade}
                onChange={(e) => handleInputChange('idade', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Ano Escolar e Tipo de Escola</label>
              <input
                type="text"
                name="anoEscolar"
                placeholder="Ex: 3º ano - Escola Regular Inclusiva"
                value={formData.anoEscolar}
                onChange={(e) => handleInputChange('anoEscolar', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Quem está preenchendo este formulário e qual sua relação com o aluno?</label>
              <textarea
                name="responsavelPreenchimento"
                value={formData.responsavelPreenchimento}
                onChange={(e) => handleInputChange('responsavelPreenchimento', e.target.value)}
                className="form-textarea"
                rows="3"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-section">
            <h2>Passo 2: Contexto Familiar e Social</h2>
            <p className="section-description">
              Informações sobre a estrutura familiar e relacionamentos do aluno.
            </p>

            <div className="form-group">
              <label>Os pais vivem juntos? Se não, como é o arranjo de moradia do aluno?</label>
              <textarea
                value={formData.arranjoMoradia}
                onChange={(e) => handleInputChange('arranjoMoradia', e.target.value)}
                className="form-textarea"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Descreva como é o relacionamento dos pais entre si (ou cuidadores principais)</label>
              <textarea
                value={formData.relacionamentoPais}
                onChange={(e) => handleInputChange('relacionamentoPais', e.target.value)}
                className="form-textarea"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Descreva como é o relacionamento do aluno com a figura materna</label>
              <textarea
                value={formData.relacionamentoMae}
                onChange={(e) => handleInputChange('relacionamentoMae', e.target.value)}
                className="form-textarea"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Descreva como é o relacionamento do aluno com a figura paterna</label>
              <textarea
                value={formData.relacionamentoPai}
                onChange={(e) => handleInputChange('relacionamentoPai', e.target.value)}
                className="form-textarea"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Descreva como é o relacionamento do aluno com os irmãos (se houver)</label>
              <textarea
                value={formData.relacionamentoIrmaos}
                onChange={(e) => handleInputChange('relacionamentoIrmaos', e.target.value)}
                className="form-textarea"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Descreva como é o relacionamento do aluno com outros familiares próximos</label>
              <textarea
                value={formData.relacionamentoFamilia}
                onChange={(e) => handleInputChange('relacionamentoFamilia', e.target.value)}
                className="form-textarea"
                rows="3"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-section">
            <h2>Passo 3: Histórico de Saúde e Desenvolvimento</h2>
            <p className="section-description">
              Informações médicas, diagnósticos e desenvolvimento inicial.
            </p>

            <div className="form-group">
              <label>Qual o principal motivo ou desafio que o levou a buscar esta ferramenta?</label>
              <textarea
                value={formData.motivoPrincipal}
                onChange={(e) => handleInputChange('motivoPrincipal', e.target.value)}
                className="form-textarea"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>O aluno possui algum diagnóstico formal? (Marque todos que se aplicam)</label>
              <div className="checkbox-group">
                {diagnosticoOptions.map((diagnostico, index) => (
                  <label key={index} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.diagnosticos.includes(diagnostico)}
                      onChange={() => handleDiagnosticoChange(diagnostico)}
                    />
                    {diagnostico}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Quais terapias ou suportes o aluno frequenta ou já frequentou?</label>
              <textarea
                value={formData.terapias}
                onChange={(e) => handleInputChange('terapias', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Ex: Fonoaudiologia, T.O., Psicologia, Psicopedagogia, Mediação Escolar"
              />
            </div>

            <div className="form-group">
              <label>Como foram os marcos do desenvolvimento inicial?</label>
              <textarea
                value={formData.marcosDesenvolvimento}
                onChange={(e) => handleInputChange('marcosDesenvolvimento', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Ex: Engatinhar, andar, primeiras palavras - dentro do esperado, atrasado, adiantado"
              />
            </div>

            <div className="form-group">
              <label>Existe alguma condição médica relevante?</label>
              <textarea
                value={formData.condicoesMedicas}
                onChange={(e) => handleInputChange('condicoesMedicas', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Ex: Alergias, distúrbios do sono, epilepsia, condições genéticas"
              />
            </div>

            <div className="form-group">
              <label>Há histórico de neurodivergências ou dificuldades de aprendizagem na família próxima?</label>
              <div className="radio-group">
                {['sim', 'nao', 'nao_sei'].map((option) => (
                  <label key={option} className="radio-label">
                    <input
                      type="radio"
                      name="historicoFamiliar"
                      value={option}
                      checked={formData.historicoFamiliar === option}
                      onChange={(e) => handleInputChange('historicoFamiliar', e.target.value)}
                    />
                    {option === 'sim' ? 'Sim' : option === 'nao' ? 'Não' : 'Não sei'}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="form-section">
            <h2>Passo 4: Perfil de Processamento Sensorial</h2>
            <p className="step-description">
              Como o aluno processa diferentes estímulos sensoriais do ambiente.
            </p>

            <div className="form-group">
              <label>Audição: Como ele(a) reage a sons?</label>
              <textarea
                value={formData.perfilAudicao}
                onChange={(e) => handleInputChange('perfilAudicao', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Ex: Cobre os ouvidos com ruídos repentinos, parece não ouvir quando chamado, busca fazer barulhos altos"
              />
            </div>

            <div className="form-group">
              <label>Visão: Como ele(a) reage a estímulos visuais?</label>
              <textarea
                value={formData.perfilVisao}
                onChange={(e) => handleInputChange('perfilVisao', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Ex: Incomoda-se com luz forte, fica fascinado por luzes girando, organiza objetos por cor/linha"
              />
            </div>

            <div className="form-group">
              <label>Tato: Como ele(a) reage ao toque e texturas?</label>
              <textarea
                value={formData.perfilTato}
                onChange={(e) => handleInputChange('perfilTato', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Ex: Evita se sujar, corta etiquetas de roupas, busca abraços apertados, toca em tudo"
              />
            </div>

            <div className="form-group">
              <label>Paladar e Olfato: Como são suas preferências alimentares e reações a cheiros?</label>
              <textarea
                value={formData.perfilPaladarOlfato}
                onChange={(e) => handleInputChange('perfilPaladarOlfato', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Ex: Seletividade alimentar extrema, cheira comidas/objetos, forte reação a perfumes"
              />
            </div>

            <div className="form-group">
              <label>Movimento (Vestibular): Como é sua relação com o movimento?</label>
              <textarea
                value={formData.perfilVestibular}
                onChange={(e) => handleInputChange('perfilVestibular', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Ex: Busca girar e balançar intensamente, tem medo de altura, parece desajeitado e tropeça com frequência"
              />
            </div>

            <div className="form-group">
              <label>Consciência Corporal (Propriocepção): Como ele(a) percebe o próprio corpo no espaço?</label>
              <textarea
                value={formData.perfilPropriocepcao}
                onChange={(e) => handleInputChange('perfilPropriocepcao', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Ex: Usa força demais sem perceber, gosta de se espremer em lugares apertados, esbarra em móveis"
              />
            </div>

            <div className="form-group">
              <label>Sinais Internos (Interocepção): Ele(a) parece identificar e comunicar sensações internas?</label>
              <textarea
                value={formData.perfilInterocepcao}
                onChange={(e) => handleInputChange('perfilInterocepcao', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Ex: Dificuldade em perceber fome, sede, vontade de ir ao banheiro ou dor"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="form-section">
            <h2>Passo 5: Funções Executivas e Cognição</h2>
            <p className="step-description">
              Habilidades de planejamento, organização, memória e controle executivo.
            </p>

            <div className="form-group">
              <label>Iniciação de Tarefa: Qual a dificuldade para começar uma atividade?</label>
              <textarea
                value={formData.iniciacaoTarefa}
                onChange={(e) => handleInputChange('iniciacaoTarefa', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Descreva a dificuldade para começar atividades, mesmo as que ele(a) sabe fazer"
              />
            </div>

            <div className="form-group">
              <label>Atenção Sustentada: Por quanto tempo consegue se manter focado?</label>
              <textarea
                value={formData.atencaoSustentada}
                onChange={(e) => handleInputChange('atencaoSustentada', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Tempo de foco em atividades que não são de seu hiperfoco"
              />
            </div>

            <div className="form-group">
              <label>Planejamento e Sequenciamento: Como lida com tarefas que exigem vários passos?</label>
              <textarea
                value={formData.planejamentoSequenciamento}
                onChange={(e) => handleInputChange('planejamentoSequenciamento', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Ex: Arrumar a mochila, seguir uma receita, organizar sequência de ações"
              />
            </div>

            <div className="form-group">
              <label>Organização: Como é a organização de seus pertences e espaços?</label>
              <textarea
                value={formData.organizacao}
                onChange={(e) => handleInputChange('organizacao', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Organização de materiais escolares, quarto, brinquedos"
              />
            </div>

            <div className="form-group">
              <label>Memória de Trabalho: Como é sua capacidade de guardar informação na mente?</label>
              <textarea
                value={formData.memoriaTrabalho}
                onChange={(e) => handleInputChange('memoriaTrabalho', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Ex: Lembrar de 3 instruções dadas de uma vez"
              />
            </div>

            <div className="form-group">
              <label>Controle de Impulsos: Frequência de ações sem pensar?</label>
              <textarea
                value={formData.controleImpulsos}
                onChange={(e) => handleInputChange('controleImpulsos', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Agir ou falar sem pensar, interromper outros, dificuldade em esperar sua vez"
              />
            </div>

            <div className="form-group">
              <label>Flexibilidade Cognitiva: Como reage a mudanças inesperadas?</label>
              <textarea
                value={formData.flexibilidadeCognitiva}
                onChange={(e) => handleInputChange('flexibilidadeCognitiva', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Reação a mudanças na rotina ou quando um plano precisa ser alterado"
              />
            </div>

            <div className="form-group">
              <label>Automonitoração: Consegue revisar o próprio trabalho?</label>
              <textarea
                value={formData.automonitoria}
                onChange={(e) => handleInputChange('automonitoria', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Revisar trabalho em busca de erros, perceber quando está perdendo o foco"
              />
            </div>

            <div className="form-group">
              <label>Velocidade de Processamento: Precisa de mais tempo que os colegas?</label>
              <textarea
                value={formData.velocidadeProcessamento}
                onChange={(e) => handleInputChange('velocidadeProcessamento', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Tempo para processar perguntas e formular respostas comparado aos pares"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="form-section">
            <h2>Passo 6: Comunicação, Linguagem e Socialização</h2>
            <p className="step-description">
              Habilidades de comunicação, expressão e interação social.
            </p>

            <div className="form-group">
              <label>Linguagem Expressiva: Como expressa suas vontades e ideias?</label>
              <textarea
                value={formData.linguagemExpressiva}
                onChange={(e) => handleInputChange('linguagemExpressiva', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Ex: Frases completas, palavras soltas, gestos"
              />
            </div>

            <div className="form-group">
              <label>Linguagem Receptiva: Como é a compreensão do que os outros falam?</label>
              <textarea
                value={formData.linguagemReceptiva}
                onChange={(e) => handleInputChange('linguagemReceptiva', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Ex: Entende tudo, entende melhor com apoio visual, compreende apenas instruções simples"
              />
            </div>

            <div className="form-group">
              <label>Linguagem Pragmática (Social): Como usa a linguagem em contextos sociais?</label>
              <textarea
                value={formData.linguagemPragmatica}
                onChange={(e) => handleInputChange('linguagemPragmatica', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Ex: Mantém o tópico da conversa, inicia papo, usa saudações"
              />
            </div>

            <div className="form-group">
              <label>Comunicação Não-Verbal: Como usa e compreende gestos e expressões?</label>
              <textarea
                value={formData.comunicacaoNaoVerbal}
                onChange={(e) => handleInputChange('comunicacaoNaoVerbal', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Uso e compreensão de gestos, expressões faciais e contato visual"
              />
            </div>

            <div className="form-group">
              <label>Literalidade: Tendência de interpretar a linguagem de forma literal?</label>
              <textarea
                value={formData.literalidade}
                onChange={(e) => handleInputChange('literalidade', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Dificuldade em entender piadas, ironias ou metáforas"
              />
            </div>

            <div className="form-group">
              <label>Motivação Social: Busca ativamente a interação com colegas?</label>
              <textarea
                value={formData.motivacaoSocial}
                onChange={(e) => handleInputChange('motivacaoSocial', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Prefere atividades solitárias ou busca interação social"
              />
            </div>

            <div className="form-group">
              <label>Relações com Pares: Como são suas amizades?</label>
              <textarea
                value={formData.relacoesPares}
                onChange={(e) => handleInputChange('relacoesPares', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Ex: Tem um melhor amigo, brinca com vários colegas, tem dificuldade em fazer/manter amigos"
              />
            </div>

            <div className="form-group">
              <label>Teoria da Mente: Como entende que outros têm perspectivas diferentes?</label>
              <textarea
                value={formData.teoriaMente}
                onChange={(e) => handleInputChange('teoriaMente', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Capacidade de entender que os outros têm pensamentos, sentimentos e perspectivas diferentes"
              />
            </div>

            <div className="form-group">
              <label>Comportamento em Grupo: Como se comporta em atividades de grupo?</label>
              <textarea
                value={formData.comportamentoGrupo}
                onChange={(e) => handleInputChange('comportamentoGrupo', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Comportamento em atividades de grupo na escola ou brincadeiras"
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="form-section">
            <h2>Passo 7: Perfil Comportamental e Emocional</h2>
            <p className="step-description">
              Regulação emocional, comportamentos e reações do aluno.
            </p>

            <div className="form-group">
              <label>Regulação Emocional: Como lida com emoções intensas?</label>
              <textarea
                value={formData.regulacaoEmocional}
                onChange={(e) => handleInputChange('regulacaoEmocional', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Como lida com frustração, raiva ou decepção"
              />
            </div>

            <div className="form-group">
              <label>Gatilhos Comportamentais: O que desencadeia crises ou comportamentos desafiadores?</label>
              <textarea
                value={formData.gatilhosComportamentais}
                onChange={(e) => handleInputChange('gatilhosComportamentais', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Situações que tipicamente desencadeiam meltdowns, shutdowns ou comportamentos desafiadores"
              />
            </div>

            <div className="form-group">
              <label>Comportamentos Repetitivos/Rituais: Apresenta movimentos ou rituais específicos?</label>
              <textarea
                value={formData.comportamentosRepetitivos}
                onChange={(e) => handleInputChange('comportamentosRepetitivos', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Movimentos repetitivos (stims), interesses restritos ou forte apego a rotinas e rituais"
              />
            </div>

            <div className="form-group">
              <label>Reação a Limites e Figuras de Autoridade: Como reage a 'não' e correções?</label>
              <textarea
                value={formData.reacaoLimites}
                onChange={(e) => handleInputChange('reacaoLimites', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Como geralmente reage ao receber um 'não', uma instrução ou uma correção de um adulto"
              />
            </div>

            <div className="form-group">
              <label>Resiliência: Como se recupera após dificuldades?</label>
              <textarea
                value={formData.resiliencia}
                onChange={(e) => handleInputChange('resiliencia', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Como se recupera após uma dificuldade, um erro ou uma situação estressante"
              />
            </div>
          </div>
        );

      case 8:
        return (
          <div className="form-section">
            <h2>Passo 8: Habilidades Motoras</h2>
            <p className="step-description">
              Desenvolvimento e coordenação das habilidades motoras finas e grossas.
            </p>

            <div className="form-group">
              <label>Motricidade Fina: Como são as habilidades que usam as mãos?</label>
              <textarea
                value={formData.motricidadeFina}
                onChange={(e) => handleInputChange('motricidadeFina', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Ex: Caligrafia, desenho, amarrar sapatos, usar talheres, abotoar roupas"
              />
            </div>

            <div className="form-group">
              <label>Motricidade Grossa: Como são as habilidades que usam o corpo todo?</label>
              <textarea
                value={formData.motricidadeGrossa}
                onChange={(e) => handleInputChange('motricidadeGrossa', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Ex: Correr, pular, chutar uma bola, equilíbrio, andar de bicicleta"
              />
            </div>
          </div>
        );

      case 9:
        return (
          <div className="form-section">
            <h2>Passo 9: Pontos Fortes, Interesses e Motivadores</h2>
            <p className="step-description">
              Talentos, interesses especiais e o que motiva o aluno.
            </p>

            <div className="form-group">
              <label>Hiperfocos e Interesses Especiais: Descreva com detalhes os assuntos que o fascinam</label>
              <textarea
                value={formData.hiperfocos}
                onChange={(e) => handleInputChange('hiperfocos', e.target.value)}
                className="form-textarea"
                rows="4"
                placeholder="Assuntos, personagens ou atividades que o fascinam profundamente. O que ele(a) amaria fazer o dia todo?"
              />
            </div>

            <div className="form-group">
              <label>Superpoderes e Habilidades Únicas: Quais são seus maiores talentos?</label>
              <textarea
                value={formData.superpoderes}
                onChange={(e) => handleInputChange('superpoderes', e.target.value)}
                className="form-textarea"
                rows="4"
                placeholder="Ex: Memória excepcional, justiça, honestidade, talento artístico, habilidade com tecnologia, empatia com animais, pensamento lógico"
              />
            </div>

            <div className="form-group">
              <label>Sistema de Recompensa: O que mais o(a) motiva a realizar uma tarefa?</label>
              <textarea
                value={formData.sistemaRecompensa}
                onChange={(e) => handleInputChange('sistemaRecompensa', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Ex: Elogios, tempo para o hiperfoco, um objeto desejado, um sistema de pontos, escolher a próxima atividade"
              />
            </div>
          </div>
        );

      case 10:
        return (
          <div className="form-section">
            <h2>Passo 10: Objetivos e Informações Adicionais</h2>
            <p className="step-description">
              Objetivos principais e informações complementares importantes.
            </p>

            <div className="form-group">
              <label>Quais são os 3 principais objetivos que você espera que a JHON AI ajude a alcançar?</label>
              <div className="objectives-group">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="objective-item">
                    <label>Objetivo {index + 1}:</label>
                    <input
                      type="text"
                      value={formData.objetivos[index] || ''}
                      onChange={(e) => handleObjetivoChange(index, e.target.value)}
                      className="form-input"
                      placeholder={`Ex: ${index === 0 ? 'Melhorar a concentração nas aulas' : index === 1 ? 'Fazer um amigo na escola' : 'Conseguir seguir a rotina matinal sem estresse'}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Existe algo mais que você acredita ser fundamental para entendermos o aluno?</label>
              <textarea
                value={formData.informacoesAdicionais}
                onChange={(e) => handleInputChange('informacoesAdicionais', e.target.value)}
                className="form-textarea"
                rows="5"
                placeholder="Qualquer detalhe adicional que você considera importante para compreender o aluno em sua totalidade"
              />
            </div>

            {/* Seção de Laudo Médico (opcional) */}
            {showLaudoSection && (
              <div className="laudo-section">
                <div className="laudo-divider">
                  <h3>📋 Laudo Médico (Opcional)</h3>
                  <p className="laudo-description">
                    Se você possui um laudo médico, pode anexá-lo agora. Esta etapa é <strong>totalmente opcional</strong> 
                    - algumas crianças ainda estão em processo de investigação ou não possuem diagnóstico formal.
                  </p>
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.possuiLaudo}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          possuiLaudo: e.target.checked
                        }));
                        if (!e.target.checked) {
                          setSelectedFile(null);
                          setFormData(prev => ({
                            ...prev,
                            laudoTexto: '',
                            laudoArquivo: null,
                            laudoTipoArquivo: '',
                            laudoNomeOriginal: ''
                          }));
                        }
                      }}
                    />
                    Desejo anexar informações do laudo médico
                  </label>
                </div>

                {formData.possuiLaudo && (
                  <div className="laudo-options">
                    <div className="form-group">
                      <label>Opção 1: Descrever o laudo em texto</label>
                      <textarea
                        value={formData.laudoTexto}
                        onChange={(e) => handleInputChange('laudoTexto', e.target.value)}
                        className="form-textarea"
                        rows="4"
                        placeholder="Descreva as informações principais do laudo médico..."
                      />
                    </div>

                    <div className="form-group">
                      <label>Opção 2: Anexar arquivo do laudo (PDF, JPG, PNG - máx. 10MB) 🆕</label>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          className="form-file-input"
                          style={{ flex: 1, minWidth: '200px' }}
                        />
                        
                        {/* Botões de ação para arquivo existente */}
                        {formData.laudoNomeOriginal && (
                          <>
                            <button
                              type="button"
                              onClick={downloadLaudo}
                              className="nav-button"
                              style={{ 
                                background: '#17a2b8', 
                                padding: '8px 12px',
                                fontSize: '14px',
                                width: 'auto',
                                minWidth: 'auto'
                              }}
                            >
                              <Download style={{ fontSize: '16px', marginRight: '5px' }} />
                              Baixar
                            </button>
                            <button
                              type="button"
                              onClick={removeLaudo}
                              className="nav-button"
                              style={{ 
                                background: '#dc3545', 
                                padding: '8px 12px',
                                fontSize: '14px',
                                width: 'auto',
                                minWidth: 'auto'
                              }}
                            >
                              <Delete style={{ fontSize: '16px', marginRight: '5px' }} />
                              Remover
                            </button>
                          </>
                        )}
                      </div>
                      
                      {selectedFile && (
                        <div className="file-selected">
                          <CloudUpload style={{ fontSize: '16px', marginRight: '5px' }} />
                          ✅ Arquivo selecionado: {selectedFile.name}
                        </div>
                      )}
                      
                      {formData.laudoNomeOriginal && !selectedFile && (
                        <div className="file-selected" style={{ background: '#d1ecf1', color: '#0c5460', border: '1px solid #bee5eb' }}>
                          📎 Arquivo anexado: {formData.laudoNomeOriginal}
                        </div>
                      )}
                    </div>

                    <div className="laudo-info">
                      <p><strong>💡 Dicas:</strong></p>
                      <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
                        <li>Você pode usar texto, arquivo ou ambos</li>
                        <li>Formatos aceitos: PDF, JPG, PNG (máx. 10MB)</li>
                        <li>Para substituir um arquivo, selecione um novo</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="form-section">
            <h2>Passo {currentSection}</h2>
            <p>Este passo ainda está sendo implementado...</p>
          </div>
        );
    }
  };

  return (
    <div className="anamnese-container">
      {/* Barra de Progresso Fixa */}
      <div className="progress-header">
        <div className="progress-header-content">
          <button 
            className="back-button"
            onClick={() => navigate('/home')}
          >
            <HomeIcon />
          </button>
          
          <div className="progress-section">
            <div className="progress-bar-full">
              <div 
                className="progress-fill-full" 
                style={{ width: `${(currentSection / totalSections) * 100}%` }}
              ></div>
            </div>
            <span className="progress-text">
              Passo {currentSection} de {totalSections} • {progress}% completo
            </span>
          </div>
          
        </div>
      </div>

      {/* Conteúdo do Formulário */}
      <div className="form-content">
        <div className="form-container">
          {renderSection()}
          
          {/* Navegação entre seções */}
          <div className="step-navigation">
            <button
              className="nav-button prev"
              onClick={prevSection}
              disabled={currentSection === 1}
            >
              <ArrowBack />
              Anterior
            </button>
            
            <span className="step-indicator">
              {currentSection} / {totalSections}
            </span>
            
            <button
              className={`nav-button ${currentSection === totalSections ? 'complete' : 'next'}`}
              onClick={currentSection === totalSections ? completeForm : nextSection}
            >
              {currentSection === totalSections ? 
                (showLaudoSection ? 
                  (formData.possuiLaudo && (formData.laudoTexto || formData.laudoArquivo) ? 'Concluir com Laudo' : 'Concluir sem Laudo') 
                  : 'Concluir'
                ) : 'Próxima'
              }
              {currentSection === totalSections ? <Check /> : <ArrowForward />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnamneseForm;