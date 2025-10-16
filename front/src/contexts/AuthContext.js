import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useInactivityDetector } from '../hooks/useInactivityDetector';
import InactivityModal from '../components/InactivityModal';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInactivityModal, setShowInactivityModal] = useState(false);
  const [modalStage, setModalStage] = useState('warning'); // 'warning' ou 'expired'

  // Verifica se há token salvo ao carregar a aplicação
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Erro ao recuperar dados do usuário:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        return { success: true };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao fazer login';
      return { success: false, message };
    }
  };

  // Registro
  const register = async (email, password) => {
    try {
      const response = await authAPI.register(email, password);
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        return { success: true };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      // Extrai mensagens de erro de validação
      const errorData = error.response?.data;
      
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        // Formata mensagens de validação específicas
        const validationErrors = errorData.errors.map(err => err.msg).join('; ');
        return { 
          success: false, 
          message: validationErrors,
          errors: errorData.errors 
        };
      }
      
      const message = errorData?.message || 'Erro ao criar conta';
      return { success: false, message };
    }
  };

  // Atualizar usuário
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Renovar token
  const refreshToken = async () => {
    try {
      const response = await authAPI.refreshToken();
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        return { success: true };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      return { success: false, message: 'Erro ao renovar sessão' };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  // Handlers para inatividade
  const handleInactivityWarning = () => {
    setModalStage('warning');
    setShowInactivityModal(true);
  };

  const handleInactivityTimeout = () => {
    setModalStage('expired');
    setShowInactivityModal(true);
  };

  const handleContinueSession = async () => {
    try {
      const result = await refreshToken();
      if (result.success) {
        setShowInactivityModal(false);
        resetInactivityTimer(); // Resetar o timer
      } else {
        // Se falhar o refresh, mostrar mensagem de expiração
        setModalStage('expired');
      }
    } catch (error) {
      console.error('Erro ao continuar sessão:', error);
      setModalStage('expired');
    }
  };

  const handleSessionExpired = () => {
    setShowInactivityModal(false);
    logout();
  };

  const handleCloseModal = () => {
    setShowInactivityModal(false);
    resetInactivityTimer(); // Resetar timer ao fechar modal
  };

  // Hook de detecção de inatividade
  const { resetInactivityTimer } = useInactivityDetector(
    handleInactivityWarning,
    handleInactivityTimeout,
    !!user // Apenas ativo quando usuário está logado
  );

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      
      <InactivityModal
        open={showInactivityModal}
        stage={modalStage}
        onContinue={handleContinueSession}
        onExpired={handleSessionExpired}
        onClose={modalStage === 'warning' ? handleCloseModal : null}
      />
    </AuthContext.Provider>
  );
};