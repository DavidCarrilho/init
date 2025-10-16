import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const { login, isAuthenticated } = useAuth();

  // Redireciona se já estiver logado
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Entrar</h1>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="auth-link">
          <p>Não tem uma conta?</p>
          <button
            type="button"
            onClick={() => setShowRegister(true)}
          >
            Criar conta
          </button>
        </div>
      </div>
      
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </div>
  );
};

// Modal de registro
const RegisterModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    // Validações no frontend
    const clientErrors = [];
    
    if (formData.password !== formData.confirmPassword) {
      clientErrors.push('As senhas não coincidem');
    }

    if (formData.password.length < 6) {
      clientErrors.push('Senha deve ter pelo menos 6 caracteres');
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      clientErrors.push('Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número');
    }

    if (clientErrors.length > 0) {
      setErrors(clientErrors);
      return;
    }

    setLoading(true);

    const result = await register(formData.email, formData.password);
    
    if (!result.success) {
      // Se há erros de validação do servidor, exibe cada um separadamente
      if (result.errors && Array.isArray(result.errors)) {
        const serverErrors = result.errors.map(err => err.msg);
        setErrors(serverErrors);
      } else {
        // Exibe mensagem genérica como array para manter consistência
        setErrors([result.message]);
      }
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
      <div className="auth-card">
        <h1 className="auth-title">Criar Conta</h1>
        
        {errors.length > 0 && (
          <div className="error-message">
            {errors.length === 1 ? (
              errors[0]
            ) : (
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="register-email" className="form-label">
              E-mail
            </label>
            <input
              type="email"
              id="register-email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-password" className="form-label">
              Senha
            </label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="register-password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>
            {formData.password && (
              <div className="password-requirements">
                <small>Requisitos da senha:</small>
                <ul>
                  <li style={{ color: formData.password.length >= 6 ? '#4CAF50' : '#f44336' }}>
                    Pelo menos 6 caracteres
                  </li>
                  <li style={{ color: /[a-z]/.test(formData.password) ? '#4CAF50' : '#f44336' }}>
                    Uma letra minúscula (a-z)
                  </li>
                  <li style={{ color: /[A-Z]/.test(formData.password) ? '#4CAF50' : '#f44336' }}>
                    Uma letra maiúscula (A-Z)
                  </li>
                  <li style={{ color: /\d/.test(formData.password) ? '#4CAF50' : '#f44336' }}>
                    Um número (0-9)
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password" className="form-label">
              Confirmar Senha
            </label>
            <div className="password-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirm-password"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;