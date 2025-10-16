require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { sequelize } = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const activitiesRoutes = require('./routes/activitiesRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const fileStorageService = require('./services/fileStorageService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de segurança
app.use(helmet());

// Configuração CORS - permitir ngrok para testes
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://front-mu4wwjrlo-davids-projects-8e437a48.vercel.app', 'https://vercel.app'] 
    : [
        'http://localhost:3000', 
        'http://127.0.0.1:3000', 
        /^https:\/\/.*\.ngrok-free\.app$/  // Permite qualquer subdomínio ngrok
      ],
  credentials: true
}));

// Middleware para parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/activities', activitiesRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Init API is running!' });
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Inicialização do servidor
const startServer = async () => {
  try {
    // Inicializa diretórios de upload
    await fileStorageService.initializeDirectories();

    // Testa conexão com banco de dados
    await sequelize.authenticate();
    console.log('✅ Conexão com banco de dados estabelecida com sucesso.');

    // Sincroniza modelos com o banco (removido alter para evitar loops)
    await sequelize.sync();
    console.log('✅ Modelos sincronizados com o banco de dados.');

    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📁 Arquivos disponíveis em: http://localhost:${PORT}/uploads`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();