const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body } = require('express-validator');
const studentController = require('../controllers/studentController');
const { authenticateToken } = require('../middleware/auth');

// Configuração do multer para upload de arquivos em memória
// O fileStorageService vai gerenciar o armazenamento
const storage = multer.memoryStorage();

// Filtros para tipos de arquivo permitidos
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 
    'image/jpg', 
    'image/png', 
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Apenas JPG, PNG, PDF, DOC e DOCX são aceitos.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticateToken);

// Validações para criação de estudante
const createStudentValidation = [
  body('nomeCompleto')
    .notEmpty()
    .withMessage('Nome completo é obrigatório')
    .isLength({ min: 2, max: 255 })
    .withMessage('Nome deve ter entre 2 e 255 caracteres'),
  
  body('dataNascimento')
    .notEmpty()
    .withMessage('Data de nascimento é obrigatória')
    .isDate()
    .withMessage('Data de nascimento deve ser uma data válida'),
  
  body('idade')
    .notEmpty()
    .withMessage('Idade é obrigatória'),
  
  body('anoEscolar')
    .notEmpty()
    .withMessage('Ano escolar é obrigatório'),
  
  body('responsavelPreenchimento')
    .notEmpty()
    .withMessage('Responsável pelo preenchimento é obrigatório')
];

// Validações para atualização (campos opcionais)
const updateStudentValidation = [
  body('nomeCompleto')
    .optional()
    .isLength({ min: 2, max: 255 })
    .withMessage('Nome deve ter entre 2 e 255 caracteres'),
  
  body('dataNascimento')
    .optional()
    .isDate()
    .withMessage('Data de nascimento deve ser uma data válida')
];

// Rotas
router.get('/', studentController.getStudents);
router.get('/count', studentController.getStudentCount);
router.get('/:id', studentController.getStudent);
router.post('/', createStudentValidation, studentController.createStudent);
router.put('/:id', updateStudentValidation, studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

// Rotas para gestão de laudo médico
router.post('/:id/upload-laudo', upload.single('laudoFile'), studentController.uploadLaudo);
router.get('/:id/download-laudo', studentController.downloadLaudo);
router.delete('/:id/remove-laudo', studentController.removeLaudo);

// Rotas para gestão de atividades para adaptação
router.post('/:id/upload-activity', upload.single('activityFile'), studentController.uploadActivity);
router.get('/:id/activity-status', studentController.getActivityStatus);
router.get('/:id/download-adapted-activity', studentController.downloadAdaptedActivity);
router.get('/:id/download-adapted-activity-png', studentController.downloadAdaptedActivityPNG);

// Rota para estatísticas de armazenamento (admin)
router.get('/admin/storage-stats', studentController.getStorageStats);

module.exports = router;