/**
 * src/lib/hooks/useUiState.ts
 * 
 * Hook personalizado para manejar el estado de componentes UI
 * Proporciona métodos comunes para modales, formularios, etc.
 */

import { useState, useCallback } from 'react';

interface UseUiStateOptions {
  initialOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export const useUiState = (options: UseUiStateOptions = {}) => {
  const { initialOpen = false, onOpen, onClose } = options;
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    setError(null);
    onClose?.();
  }, [onClose]);

  const setErrorMessage = useCallback((msg: string) => {
    setError(msg);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isOpen,
    isLoading,
    error,
    open,
    close,
    setLoading: setIsLoading,
    setErrorMessage,
    clearError,
  };
};
