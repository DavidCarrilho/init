import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  CheckCircle,
  Error,
  SmartToy,
  Description,
  Search,
  Psychology,
  Palette
} from '@mui/icons-material';
import { studentAPI } from '../services/api';

const ActivityProgressDialog = ({
  isOpen,
  onClose,
  studentId,
  activityId,
  onComplete
}) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('processando');
  const [message, setMessage] = useState('Iniciando processamento...');
  const [icon, setIcon] = useState('🔄');
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [showingResult, setShowingResult] = useState(false);
  const [adaptedActivity, setAdaptedActivity] = useState(null);

  console.log('🎭 ActivityProgressDialog renderizado:', { isOpen, studentId, activityId });

  useEffect(() => {
    console.log('🔄 useEffect ativado:', { isOpen, studentId });

    if (!isOpen || !studentId) {
      console.log('⏸️ Não iniciando polling:', { isOpen, studentId });
      return;
    }

    console.log('▶️ Iniciando polling de status...');
    let pollInterval;

    const pollStatus = async () => {
      try {
        const statusData = await studentAPI.getActivityStatus(studentId);

        if (statusData.success) {
          setProgress(statusData.progress || 0);
          setStatus(statusData.status);
          setMessage(statusData.message);
          setIcon(statusData.icon);

          // Se completou ou deu erro, parar polling
          if (statusData.status === 'adaptada') {
            setCompleted(true);
            if (pollInterval) {
              clearInterval(pollInterval);
            }
            // Salvar dados da atividade adaptada
            if (statusData.adaptedActivity) {
              setAdaptedActivity(statusData.adaptedActivity);
            }
            // NÃO fechar automaticamente - deixar o usuário decidir
          } else if (statusData.status === 'erro_processamento') {
            setError('Ocorreu um erro durante o processamento da atividade.');
            if (pollInterval) {
              clearInterval(pollInterval);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
        setError('Erro ao verificar o status da adaptação.');
        if (pollInterval) {
          clearInterval(pollInterval);
        }
      }
    };

    // Poll inicial
    pollStatus();

    // Poll a cada 2 segundos
    pollInterval = setInterval(pollStatus, 2000);

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [isOpen, studentId, onComplete]);

  const handleClose = () => {
    if (completed || error) {
      onClose();
    }
  };

  const handleShowResult = () => {
    setShowingResult(true);
  };

  const handleBackToProgress = () => {
    setShowingResult(false);
  };

  const getStatusIcon = (currentStatus) => {
    switch (currentStatus) {
      case 'processando':
        return <SmartToy color="primary" />;
      case 'convertendo':
        return <Description color="primary" />;
      case 'extraindo_texto':
        return <Search color="primary" />;
      case 'adaptando':
        return <Psychology color="primary" />;
      case 'finalizando':
        return <Palette color="primary" />;
      case 'adaptada':
        return <CheckCircle color="success" />;
      case 'erro_processamento':
        return <Error color="error" />;
      default:
        return <CircularProgress size={24} />;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={!completed && !error}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          {showingResult ? (
            <CheckCircle color="success" />
          ) : (
            getStatusIcon(status)
          )}
          <Typography variant="h6">
            {showingResult ? 'Atividade Adaptada' :
             completed ? 'Adaptação Concluída!' : 'Adaptando Atividade...'}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : showingResult ? (
          <Box>
            {/* Conteúdo da Atividade Adaptada */}
            <Alert severity="success" sx={{ mb: 3 }}>
              🎉 Sua atividade foi adaptada com sucesso com base no perfil do estudante!
            </Alert>

            <Typography variant="h6" gutterBottom>
              📝 {adaptedActivity?.title || 'Resultado da Adaptação'}
            </Typography>

            {/* Verificar se temos a estrutura completa da adaptação */}
            {adaptedActivity?.adaptacao ? (
              <Box>
                {/* Seção: Atividade Adaptada para o Aluno */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                    🎯 ATIVIDADE ADAPTADA PARA O ALUNO
                  </Typography>
                  <Box sx={{
                    bgcolor: '#e3f2fd',
                    p: 3,
                    borderRadius: 2,
                    border: '2px solid #2196f3',
                    mb: 2
                  }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      📝 Enunciado Adaptado:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {adaptedActivity.adaptacao.atividade_adaptada?.enunciado_reescrito}
                    </Typography>

                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      📚 Exercícios:
                    </Typography>
                    {adaptedActivity.adaptacao.atividade_adaptada?.itens?.map((item, index) => (
                      <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'white', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {index + 1}. {item.tipo.replace('_', ' ').toUpperCase()}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {item.conteudo}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Tempo sugerido: {Math.round(item.tempo_sugerido_segundos / 60)} minutos
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Seção: Orientações para o Educador */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
                    👩‍🏫 ORIENTAÇÕES PARA O EDUCADOR
                  </Typography>
                  <Box sx={{
                    bgcolor: '#f1f8e9',
                    p: 3,
                    borderRadius: 2,
                    border: '2px solid #4caf50',
                    mb: 2
                  }}>
                    {/* Como apresentar */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      ✅ Como apresentar:
                    </Typography>
                    <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                      {adaptedActivity.adaptacao.orientacoes_ao_adulto?.como_apresentar?.map((item, index) => (
                        <li key={index}>
                          <Typography variant="body2">{item}</Typography>
                        </li>
                      ))}
                    </ul>

                    {/* Erros a evitar */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      ❌ Erros a evitar:
                    </Typography>
                    <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                      {adaptedActivity.adaptacao.orientacoes_ao_adulto?.erros_comuns_a_evitar?.map((item, index) => (
                        <li key={index}>
                          <Typography variant="body2">{item}</Typography>
                        </li>
                      ))}
                    </ul>

                    {/* Sinais de sucesso */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      🎉 Sinais de sucesso:
                    </Typography>
                    <ul style={{ marginLeft: '20px' }}>
                      {adaptedActivity.adaptacao.orientacoes_ao_adulto?.sinais_de_sucesso?.map((item, index) => (
                        <li key={index}>
                          <Typography variant="body2">{item}</Typography>
                        </li>
                      ))}
                    </ul>
                  </Box>
                </Box>
              </Box>
            ) : (
              /* Fallback: Exibir conteúdo unificado se não houver estrutura separada */
              <Box sx={{
                bgcolor: 'grey.50',
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.200',
                mb: 2,
                maxHeight: 400,
                overflowY: 'auto'
              }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                  {adaptedActivity?.content || 'Carregando conteúdo da atividade adaptada...'}
                </Typography>
              </Box>
            )}

            {/* Botões de ação */}
            <Box display="flex" gap={1} mt={2} flexWrap="wrap">
              <Button
                variant="contained"
                startIcon={<Typography>🖼️</Typography>}
                onClick={() => {
                  const downloadUrl = `/api/students/${studentId}/download-adapted-activity-png`;
                  const token = localStorage.getItem('token');
                  if (token) {
                    fetch(downloadUrl, {
                      headers: {
                        'Authorization': `Bearer ${token}`
                      }
                    }).then(response => {
                      if (!response.ok) {
                        return response.json().then(errorData => {
                          throw new Error(errorData.message || 'Erro ao baixar PNG');
                        });
                      }
                      return response.blob();
                    })
                    .then(blob => {
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `atividade-adaptada.png`;
                      a.click();
                      window.URL.revokeObjectURL(url);
                    }).catch(error => {
                      console.error('Erro ao baixar PNG:', error);
                      alert(`Erro: ${error.message || 'Download de PNG temporariamente indisponível. Use o download em TXT como alternativa.'}`);
                    });
                  }
                }}
                sx={{ minWidth: '140px' }}
              >
                Baixar PNG
              </Button>

              <Button
                variant="outlined"
                startIcon={<Typography>📄</Typography>}
                onClick={() => {
                  const downloadUrl = `/api/students/${studentId}/download-adapted-activity`;
                  const token = localStorage.getItem('token');
                  if (token) {
                    fetch(downloadUrl, {
                      headers: {
                        'Authorization': `Bearer ${token}`
                      }
                    }).then(response => response.blob())
                    .then(blob => {
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `atividade-adaptada.txt`;
                      a.click();
                      window.URL.revokeObjectURL(url);
                    });
                  }
                }}
                sx={{ minWidth: '120px' }}
              >
                Baixar TXT
              </Button>

              <Button
                variant="outlined"
                startIcon={<Typography>📋</Typography>}
                onClick={() => {
                  if (adaptedActivity?.content) {
                    navigator.clipboard.writeText(adaptedActivity.content);
                    alert('Conteúdo copiado para a área de transferência!');
                  }
                }}
              >
                Copiar Conteúdo
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            {/* Barra de progresso */}
            <Box sx={{ mb: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Progresso
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {progress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>

            {/* Status atual */}
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Typography variant="h4" component="span">
                {icon}
              </Typography>
              <Typography variant="body1">
                {message}
              </Typography>
            </Box>

            {/* Etapas do processo */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Etapas do Processo:
              </Typography>

              {[
                { key: 'processando', label: 'Iniciando processamento', progress: 10 },
                { key: 'convertendo', label: 'Convertendo arquivo', progress: 25 },
                { key: 'extraindo_texto', label: 'Extraindo texto', progress: 45 },
                { key: 'adaptando', label: 'Gerando adaptação com IA', progress: 70 },
                { key: 'finalizando', label: 'Preparando resultado', progress: 90 },
                { key: 'adaptada', label: 'Concluído', progress: 100 }
              ].map((step) => (
                <Box
                  key={step.key}
                  display="flex"
                  alignItems="center"
                  gap={1}
                  py={0.5}
                  sx={{
                    opacity: progress >= step.progress ? 1 : 0.5,
                    color: progress >= step.progress ? 'success.main' : 'text.secondary'
                  }}
                >
                  {progress >= step.progress ? (
                    <CheckCircle fontSize="small" color="success" />
                  ) : progress >= step.progress - 15 ? (
                    <CircularProgress size={16} />
                  ) : (
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        border: '2px solid currentColor',
                        borderRadius: '50%',
                        opacity: 0.3
                      }}
                    />
                  )}
                  <Typography variant="body2">
                    {step.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {completed && (
              <Alert severity="success" sx={{ mt: 2 }}>
                🎉 Atividade adaptada com sucesso! Clique em "Visualizar Resultado" para ver a adaptação.
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {showingResult ? (
          <Box display="flex" gap={1}>
            <Button onClick={handleBackToProgress} variant="outlined">
              ← Voltar ao Progresso
            </Button>
            <Button onClick={handleClose} variant="contained">
              Fechar
            </Button>
          </Box>
        ) : (completed || error) ? (
          <Button onClick={handleShowResult} variant="contained">
            {completed ? 'Visualizar Resultado' : 'Fechar'}
          </Button>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Aguarde... Este processo pode levar alguns minutos
          </Typography>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ActivityProgressDialog;