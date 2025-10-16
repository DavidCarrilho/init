import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import Account from './pages/Account';
import AnamneseForm from './pages/AnamneseForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Rota padrão redireciona para /home */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            
            {/* Rota de login */}
            <Route path="/login" element={<Login />} />
            
            {/* Rota protegida da home */}
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />

            {/* Rota protegida da página de conta */}
            <Route 
              path="/account" 
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              } 
            />

            {/* Rota protegida do formulário de anamnese */}
            <Route 
              path="/form" 
              element={
                <ProtectedRoute>
                  <AnamneseForm />
                </ProtectedRoute>
              } 
            />

            {/* Rota protegida para edição de formulário */}
            <Route 
              path="/form/:id" 
              element={
                <ProtectedRoute>
                  <AnamneseForm />
                </ProtectedRoute>
              } 
            />
            
            {/* Rota para páginas não encontradas */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;