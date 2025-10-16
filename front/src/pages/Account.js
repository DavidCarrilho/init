import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Account = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleDeleteAccount = () => {
    setShowDeleteDialog(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await authAPI.deleteAccount();
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  const handleEditName = () => {
    setName(user?.name || '');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setName(user?.name || '');
    setIsEditing(false);
  };

  const handleSaveName = async () => {
    if (!name.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      const data = await authAPI.updateName(name.trim());
      updateUser(data.user);
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar nome:', error);
    }
    setIsSaving(false);
  };

  return (
    <div className="account-container">
      <header className="account-header">
        <div className="account-header-content">
          <h1 className="account-title">Minha Conta</h1>
          <button
            onClick={handleBackToHome}
            className="btn-back"
          >
            Voltar
          </button>
        </div>
      </header>

      <main className="account-content">
        <div className="account-card">
          <div className="account-info">
            <h2>Informações da Conta</h2>
            
            <div className="user-info-item">
              <strong>Email:</strong> {user?.email}
            </div>
            
            <div className="user-info-item">
              <strong>Nome:</strong>
              {isEditing ? (
                <div className="edit-name-container">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="edit-name-input"
                    placeholder="Digite seu nome..."
                    maxLength={100}
                    disabled={isSaving}
                  />
                  <div className="edit-name-actions">
                    <button
                      onClick={handleSaveName}
                      className="btn-save"
                      disabled={!name.trim() || isSaving}
                    >
                      {isSaving ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="btn-cancel-edit"
                      disabled={isSaving}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="display-name-container">
                  <span className="user-name">
                    {user?.name || 'Não informado'}
                  </span>
                  <button
                    onClick={handleEditName}
                    className="btn-edit"
                  >
                    Editar
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="danger-zone">
            <h3>Zona de Perigo</h3>
            <p>Uma vez que você exclua sua conta, não há como voltar atrás. Por favor, tenha certeza.</p>
            <button
              onClick={handleDeleteAccount}
              className="btn-delete"
              disabled={isDeleting}
            >
              {isDeleting ? 'Excluindo...' : 'Excluir Conta'}
            </button>
          </div>
        </div>
      </main>

      {showDeleteDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <h3>Confirmar Exclusão de Conta</h3>
            </div>
            <div className="dialog-content">
              <p>Tem certeza que deseja excluir sua conta?</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p className="warning-text">Esta ação não pode ser desfeita!</p>
            </div>
            <div className="dialog-actions">
              <button
                onClick={handleCancelDelete}
                className="btn-cancel"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="btn-confirm-delete"
                disabled={isDeleting}
              >
                {isDeleting ? 'Excluindo...' : 'Sim, Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;