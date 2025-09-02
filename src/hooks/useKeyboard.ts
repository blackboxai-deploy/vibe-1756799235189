'use client';

import { useState, useEffect, useCallback } from 'react';
import { KeyState } from '../lib/carPhysics';

export const useKeyboard = () => {
  const [keys, setKeys] = useState<KeyState>({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        setKeys(prev => ({ ...prev, up: true }));
        event.preventDefault();
        break;
      case 'KeyS':
      case 'ArrowDown':
        setKeys(prev => ({ ...prev, down: true }));
        event.preventDefault();
        break;
      case 'KeyA':
      case 'ArrowLeft':
        setKeys(prev => ({ ...prev, left: true }));
        event.preventDefault();
        break;
      case 'KeyD':
      case 'ArrowRight':
        setKeys(prev => ({ ...prev, right: true }));
        event.preventDefault();
        break;
    }
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        setKeys(prev => ({ ...prev, up: false }));
        event.preventDefault();
        break;
      case 'KeyS':
      case 'ArrowDown':
        setKeys(prev => ({ ...prev, down: false }));
        event.preventDefault();
        break;
      case 'KeyA':
      case 'ArrowLeft':
        setKeys(prev => ({ ...prev, left: false }));
        event.preventDefault();
        break;
      case 'KeyD':
      case 'ArrowRight':
        setKeys(prev => ({ ...prev, right: false }));
        event.preventDefault();
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const resetKeys = useCallback(() => {
    setKeys({
      up: false,
      down: false,
      left: false,
      right: false,
    });
  }, []);

  return { keys, resetKeys };
};