import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import WelcomeDialog from '../components/WelcomeDialog';
import ActivityUploadSheet from '../components/ActivityUploadSheet';
import ActivityProgressDialog from '../components/ActivityProgressDialog';
import { studentAPI, authAPI } from '../services/api';
import { Assignment, Add, School, CheckCircle, Warning, Science, Edit } from '@mui/icons-material';

const Home = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [showPopover, setShowPopover] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [canAddMore, setCanAddMore] = useState(true);
  const [showActivitySheet, setShowActivitySheet] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [currentActivityId, setCurrentActivityId] = useState(null);
  const avatarRef = useRef(null);

  const handleLogout = async () => {
    await logout();
  };

  const handleAccountClick = () => {
    setShowPopover(false);
    navigate('/account');
  };

  const togglePopover = () => {
    setShowPopover(!showPopover);
  };

  const getInitials = (email) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  const handleWelcomeConfirm = async (name) => {
    try {
      const data = await authAPI.updateName(name);
      updateUser(data.user);
      setShowWelcomeDialog(false);
    } catch (error) {
      console.error('Erro ao atualizar nome:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await studentAPI.getStudents();
      setStudents(data.students);
    } catch (error) {
      console.error('Erro ao buscar estudantes:', error);
    }
  };

  const fetchStudentCount = async () => {
    try {
      const data = await studentAPI.getStudents();
      const count = data.students.length;
      setStudentCount(count);
      setCanAddMore(count < 5);
    } catch (error) {
      console.error('Erro ao buscar contagem:', error);
    }
  };

  const handleNewForm = () => {
    if (canAddMore) {
      navigate('/form');
    }
  };

  const handleEditStudent = (studentId, e) => {
    e.stopPropagation(); // Previne click no card
    navigate(`/form/${studentId}`);
  };

  const handleAdaptActivity = (studentId, e) => {
    e.stopPropagation(); // Previne click no card
    setSelectedStudentId(studentId);
    setShowActivitySheet(true);
  };

  const handleActivityUpload = async (file, uploadType) => {
    try {
      console.log('🚀 Iniciando upload para estudante:', selectedStudentId);

      const formData = new FormData();
      formData.append('activityFile', file);

      const response = await studentAPI.uploadActivity(selectedStudentId, formData);

      console.log('📤 Resposta do upload:', response.data);

      if (response.data.success) {
        console.log('✅ Upload bem-sucedido, activity ID:', response.data.activityId);

        // Fechar o sheet de upload
        setShowActivitySheet(false);

        // Armazenar ID da atividade para monitorar progresso
        setCurrentActivityId(response.data.activityId);

        console.log('📱 Mostrando dialog de progresso...');
        console.log('Estado atual showProgressDialog:', showProgressDialog);

        // Mostrar dialog de progresso
        setShowProgressDialog(true);

        console.log('Dialog setado para true. Verificando se mudou...');
        setTimeout(() => {
          console.log('Estado após timeout:', showProgressDialog);
        }, 100);

        // Atualizar lista de estudantes (o status será "processando")
        await fetchStudents();
      }
    } catch (error) {
      console.error('❌ Erro no upload:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao enviar atividade';
      alert(errorMessage);
      throw error; // Re-throw para o componente tratar o loading
    }
  };

  const handleCloseActivitySheet = () => {
    setShowActivitySheet(false);
    setSelectedStudentId(null);
  };

  const handleProgressComplete = async () => {
    // Atualizar lista de estudantes para mostrar o resultado final
    await fetchStudents();

    // Fechar dialog de progresso
    setShowProgressDialog(false);
    setCurrentActivityId(null);
    setSelectedStudentId(null);
  };

  const handleCloseProgressDialog = () => {
    setShowProgressDialog(false);
    setCurrentActivityId(null);
    setSelectedStudentId(null);
  };

  const getLaudoStatus = (student) => {
    if (student.possuiLaudo && (student.laudoTexto || student.laudoArquivo || student.laudoUrl)) {
      return {
        status: 'com-laudo',
        text: 'Laudo Adicionado',
        icon: CheckCircle,
        color: '#28a745'
      };
    } else if (student.concluido) {
      return {
        status: 'sem-laudo',
        text: 'Cadastrado sem Laudo',
        icon: Warning,
        color: '#ffc107'
      };
    }
    return null;
  };

  useEffect(() => {
    // Mostrar diálogo de boas-vindas se for primeiro acesso
    if (user && user.isFirstAccess) {
      setShowWelcomeDialog(true);
    }
    
    // Carregar dados dos estudantes
    if (user) {
      fetchStudents();
      fetchStudentCount();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setShowPopover(false);
      }
    };

    if (showPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopover]);

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="home-header-content">
          <h1 className="home-title">Init</h1>
          <div className="avatar-container" ref={avatarRef}>
            <div 
              className="avatar"
              onClick={togglePopover}
            >
              {getInitials(user?.email)}
            </div>
            {showPopover && (
              <div className="avatar-popover">
                <div 
                  className="popover-item"
                  onClick={handleAccountClick}
                >
                  Conta
                </div>
                <div 
                  className="popover-item"
                  onClick={handleLogout}
                >
                  Sair
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="home-content">
        <div className="welcome-message">
          Bem-vindo{user?.name ? `, ${user.name}` : `, ${user?.email}`}!
        </div>
        
        {/* Card do Formulário */}
        <div className="form-card" onClick={handleNewForm} style={{ cursor: canAddMore ? 'pointer' : 'not-allowed', opacity: canAddMore ? 1 : 0.6 }}>
          <div className="form-card-header">
            <Assignment style={{ fontSize: 24, color: '#007bff' }} />
            <h3>Formulário de Anamnese</h3>
          </div>
          <p>Complete o questionário detalhado para criar o perfil personalizado do aluno</p>
          <div className="form-card-footer">
            <span>{studentCount}/5 cadastros realizados</span>
            {canAddMore && <Add style={{ fontSize: 20 }} />}
          </div>
        </div>

        {/* Listagem de Estudantes */}
        {students.length > 0 && (
          <div className="students-section">
            <h3>Estudantes Cadastrados</h3>
            <div className="students-list">
              {students.map((student) => {
                const laudoStatus = getLaudoStatus(student);
                const StatusIcon = laudoStatus?.icon || School;
                
                return (
                  <div key={student.id} className="student-card">
                    <div className="student-card-header">
                      <School style={{ fontSize: 20, color: '#28a745' }} />
                      <h4>{student.nomeCompleto}</h4>
                    </div>
                    <div className="student-card-info">
                      <span>Idade: {student.idade}</span>
                      <span>Ano: {student.anoEscolar}</span>
                    </div>
                    
                    {/* Status do Laudo */}
                    {laudoStatus && (
                      <div className="student-laudo-status" style={{ color: laudoStatus.color }}>
                        <StatusIcon style={{ fontSize: 16, marginRight: '5px' }} />
                        <span>{laudoStatus.text}</span>
                      </div>
                    )}
                    
                    <div className="student-card-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${student.progressoFormulario}%` }}
                        ></div>
                      </div>
                      <span>{student.progressoFormulario}% completo</span>
                    </div>
                    
                    {/* Botões de ação */}
                    <div className="student-card-actions">
                      <button 
                        className="edit-student-button"
                        onClick={(e) => handleEditStudent(student.id, e)}
                      >
                        <Edit style={{ fontSize: 16, marginRight: '5px' }} />
                        Editar Dados
                      </button>
                      
                      {/* Botão Adaptar Atividade para estudantes com laudo */}
                      {laudoStatus?.status === 'com-laudo' && (
                        <button
                          className="adapt-activity-button"
                          onClick={(e) => handleAdaptActivity(student.id, e)}
                        >
                          <Science style={{ fontSize: 16, marginRight: '5px' }} />
                          Adaptar Atividade
                        </button>
                      )}

                      {/* TODO: Implementar funcionalidade "Ver Última Atividade Adaptada"
                          * Este botão pode ser transformado futuramente para permitir visualizar
                          * a última atividade adaptada do estudante, caso ela já tenha sido processada
                          * Funcionalidade planejada:
                          * - Verificar se existe atividade adaptada (status === 'adaptada')
                          * - Abrir dialog diretamente na tela de resultado
                          * - Permitir download e visualização da atividade já processada
                          * - Útil para revisitar adaptações anteriores
                      */}
                      {/*
                      <button
                        className="adapt-activity-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implementar lógica para abrir última atividade adaptada
                          setSelectedStudentId(student.id);
                          setCurrentActivityId(student.atividadeArquivo);
                          setShowProgressDialog(true);
                        }}
                        style={{ backgroundColor: '#4caf50', marginTop: '5px' }}
                      >
                        📋 Ver Última Atividade
                      </button>
                      */}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <WelcomeDialog
        isOpen={showWelcomeDialog}
        onConfirm={handleWelcomeConfirm}
        onClose={() => setShowWelcomeDialog(false)}
        userEmail={user?.email}
      />

      <ActivityUploadSheet
        isOpen={showActivitySheet}
        onClose={handleCloseActivitySheet}
        onUpload={handleActivityUpload}
        studentId={selectedStudentId}
      />

      <ActivityProgressDialog
        isOpen={showProgressDialog}
        onClose={handleCloseProgressDialog}
        studentId={selectedStudentId}
        activityId={currentActivityId}
        onComplete={handleProgressComplete}
      />
    </div>
  );
};

export default Home;