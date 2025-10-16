import React, { useState } from 'react';

const WelcomeDialog = ({ isOpen, onConfirm, onClose, userEmail }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }

    setIsSubmitting(true);
    await onConfirm(name.trim());
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="welcome-dialog">
        <div className="welcome-dialog-header">
          <h2>🎉 Bem-vindo à Init!</h2>
          <button
            className="welcome-dialog-close"
            onClick={onClose}
            type="button"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
        
        <div className="welcome-dialog-content">
          <p>Olá! Sua conta foi criada com sucesso.</p>
          <p>Como você gostaria de ser chamado?</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="welcome-name" className="form-label">
                Seu nome
              </label>
              <input
                id="welcome-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome..."
                className="form-input"
                maxLength={100}
                autoFocus
                disabled={isSubmitting}
              />
            </div>
            
            <div className="welcome-dialog-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!name.trim() || isSubmitting}
              >
                {isSubmitting ? 'Salvando...' : 'Continuar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WelcomeDialog;