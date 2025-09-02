'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface AudioConfig {
  volume: number;
  muted: boolean;
}

export const useAudio = () => {
  const [config, setConfig] = useState<AudioConfig>({
    volume: 0.7,
    muted: false,
  });

  const audioContextRef = useRef<AudioContext | undefined>(undefined);
  const soundsRef = useRef<Map<string, AudioBuffer>>(new Map());

  useEffect(() => {
    // Initialize audio context on first user interaction
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };

    const handleUserInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  const loadSound = useCallback(async (name: string, url: string) => {
    if (!audioContextRef.current) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      soundsRef.current.set(name, audioBuffer);
    } catch (error) {
      console.warn(`Failed to load sound ${name}:`, error);
    }
  }, []);

  const playSound = useCallback((name: string, options?: { loop?: boolean; volume?: number }) => {
    if (config.muted || !audioContextRef.current) return;

    const buffer = soundsRef.current.get(name);
    if (!buffer) return;

    const source = audioContextRef.current.createBufferSource();
    const gainNode = audioContextRef.current.createGain();

    source.buffer = buffer;
    source.loop = options?.loop || false;
    gainNode.gain.value = (options?.volume || 1) * config.volume;

    source.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    source.start();

    return source;
  }, [config.muted, config.volume]);

  const generateEngineSound = useCallback((speed: number, maxSpeed: number) => {
    if (config.muted || !audioContextRef.current) return;

    // Generate simple engine sound using oscillators
    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    // Engine frequency based on speed
    const baseFreq = 80;
    const speedRatio = Math.abs(speed) / maxSpeed;
    oscillator.frequency.value = baseFreq + speedRatio * 200;
    oscillator.type = 'sawtooth';

    // Volume based on speed
    gainNode.gain.value = Math.min(0.1, speedRatio * 0.15) * config.volume;

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.1);
  }, [config.muted, config.volume]);

  const generateCollisionSound = useCallback(() => {
    if (config.muted || !audioContextRef.current) return;

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.frequency.value = 150;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.3 * config.volume, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.2);
  }, [config.muted, config.volume]);

  const generateCountdownBeep = useCallback((isStart: boolean = false) => {
    if (config.muted || !audioContextRef.current) return;

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.frequency.value = isStart ? 880 : 440;
    oscillator.type = 'sine';
    
    gainNode.gain.value = 0.4 * config.volume;

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + (isStart ? 0.5 : 0.2));
  }, [config.muted, config.volume]);

  const setVolume = useCallback((volume: number) => {
    setConfig(prev => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }));
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    setConfig(prev => ({ ...prev, muted }));
  }, []);

  return {
    config,
    loadSound,
    playSound,
    generateEngineSound,
    generateCollisionSound,
    generateCountdownBeep,
    setVolume,
    setMuted,
  };
};