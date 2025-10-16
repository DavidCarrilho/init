import { useEffect, useCallback, useRef } from 'react';

const INACTIVITY_TIMEOUT = 20 * 60 * 1000; // 20 minutos em ms
const WARNING_TIME = 2 * 60 * 1000; // Aviso 2 minutos antes

export const useInactivityDetector = (onWarning, onTimeout, isActive = true) => {
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  // Lista de eventos que indicam atividade do usuário
  const events = [
    'mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'
  ];

  const resetTimer = useCallback(() => {
    if (!isActive) return;

    const now = Date.now();
    lastActivityRef.current = now;

    // Limpar timeouts existentes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Configurar timeout para aviso (antes do timeout final)
    warningTimeoutRef.current = setTimeout(() => {
      if (onWarning) {
        onWarning();
      }
    }, INACTIVITY_TIMEOUT - WARNING_TIME);

    // Configurar timeout final
    timeoutRef.current = setTimeout(() => {
      if (onTimeout) {
        onTimeout();
      }
    }, INACTIVITY_TIMEOUT);
  }, [isActive, onWarning, onTimeout]);

  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    if (!isActive) {
      // Limpar timeouts quando inativo
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      return;
    }

    // Adicionar listeners de evento
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Inicializar timer
    resetTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [isActive, handleActivity, resetTimer]);

  // Função para resetar manualmente o timer (útil quando o usuário interage com a aplicação)
  const resetInactivityTimer = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  return {
    resetInactivityTimer,
    lastActivity: lastActivityRef.current
  };
};