import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  IconButton
} from '@mui/material';
import { Warning, Close } from '@mui/icons-material';

const InactivityModal = ({ 
  open, 
  onContinue, 
  onExpired, 
  onClose,
  stage = 'warning' // 'warning' ou 'expired'
}) => {
  const [countdown, setCountdown] = useState(120); // 2 minutos em segundos
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && stage === 'warning') {
      setCountdown(120);
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Automaticamente chamar onExpired quando o countdown chegar a zero
            onExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [open, stage, onExpired]);

  const handleContinue = async () => {
    if (stage === 'warning') {
      setIsLoading(true);
      try {
        await onContinue();
      } finally {
        setIsLoading(false);
      }
    } else {
      // Stage 'expired' - apenas confirmar que entendeu
      onExpired();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (stage === 'warning') {
    return (
      <Dialog
        open={open}
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 400,
            maxWidth: 500
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1, position: 'relative' }}>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            <Warning color="warning" fontSize="large" />
            <Typography variant="h6" color="warning.main">
              Tempo de Inatividade
            </Typography>
          </Box>
          {onClose && (
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'grey.500',
              }}
            >
              <Close />
            </IconButton>
          )}
        </DialogTitle>
        
        <DialogContent sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Você atingiu o tempo de inatividade. Deseja continuar?
          </Typography>
          
          <Box 
            sx={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              backgroundColor: 'warning.light',
              borderRadius: 1,
              px: 2,
              py: 1,
              color: 'warning.dark'
            }}
          >
            <Typography variant="body2" fontWeight="medium">
              Sessão expira em:
            </Typography>
            <Typography 
              variant="h6" 
              fontWeight="bold"
              sx={{ 
                fontFamily: 'monospace',
                color: countdown <= 30 ? 'error.main' : 'inherit'
              }}
            >
              {formatTime(countdown)}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={handleContinue}
            variant="contained"
            color="primary"
            size="large"
            disabled={isLoading}
            sx={{ minWidth: 120 }}
          >
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Sim, Continuar'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // Stage 'expired'
  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: 400,
          maxWidth: 500
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
          <Warning color="error" fontSize="large" />
          <Typography variant="h6" color="error.main">
            Sessão Expirada
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Por favor, seu tempo expirou.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Você será redirecionado para fazer login novamente.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button
          onClick={handleContinue}
          variant="contained"
          color="primary"
          size="large"
          sx={{ minWidth: 120 }}
        >
          Entendi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InactivityModal;