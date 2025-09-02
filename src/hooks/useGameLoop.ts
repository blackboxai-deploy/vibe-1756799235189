'use client';

import { useEffect, useRef, useCallback } from 'react';

export interface GameLoopCallbacks {
  update: (deltaTime: number) => void;
  render: () => void;
}

export const useGameLoop = (callbacks: GameLoopCallbacks, isRunning: boolean = true) => {
  const frameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const callbacksRef = useRef(callbacks);

  // Update callbacks ref when they change
  callbacksRef.current = callbacks;

  const gameLoop = useCallback((currentTime: number) => {
    if (!isRunning) return;

    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    // Cap delta time to prevent large jumps (60fps = ~16.67ms)
    const cappedDelta = Math.min(deltaTime, 32);

    // Update game logic
    callbacksRef.current.update(cappedDelta);

    // Render frame
    callbacksRef.current.render();

    // Schedule next frame
    frameRef.current = requestAnimationFrame(gameLoop);
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      lastTimeRef.current = performance.now();
      frameRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [gameLoop, isRunning]);

  const startLoop = useCallback(() => {
    if (!frameRef.current) {
      lastTimeRef.current = performance.now();
      frameRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameLoop]);

  const stopLoop = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = undefined;
    }
  }, []);

  return { startLoop, stopLoop };
};