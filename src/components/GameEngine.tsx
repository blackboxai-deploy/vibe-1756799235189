'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { useKeyboard } from '../hooks/useKeyboard';
import { useAudio } from '../hooks/useAudio';
import { getGameData, updateGameData, createCar, Car, Track, CAR_COLORS } from '../lib/gameState';
import { updateCarPhysics, checkCarCollision, resolveCarCollision, checkWallCollision, resolveWallCollision } from '../lib/carPhysics';
import { updateAI, initializeAIDriver } from '../lib/aiRacing';
import { calculateLapProgress } from '../lib/tracks';

interface GameEngineProps {
  track: Track;
  onRaceFinish: (results: any) => void;
  onPause: () => void;
}

export const GameEngine: React.FC<GameEngineProps> = ({ track, onRaceFinish, onPause }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [initialized, setInitialized] = useState(false);
  const { keys } = useKeyboard();
  const { generateEngineSound, generateCollisionSound, generateCountdownBeep } = useAudio();
  const gameData = getGameData();

  // Initialize race
  useEffect(() => {
    if (!initialized) {
      initializeRace();
      setInitialized(true);
    }
  }, [initialized]);

  const initializeRace = () => {
    const cars: Car[] = [];
    
    // Create player car
    const playerCar = createCar(
      'player',
      track.startPosition.x,
      track.startPosition.y,
      CAR_COLORS[0],
      true
    );
    playerCar.rotation = track.startPosition.rotation;
    cars.push(playerCar);

    // Create AI cars
    for (let i = 1; i < 6; i++) {
      const aiCar = createCar(
        `ai_${i}`,
        track.startPosition.x - i * 25,
        track.startPosition.y + (i % 2 === 0 ? 30 : -30),
        CAR_COLORS[i % CAR_COLORS.length],
        false
      );
      aiCar.rotation = track.startPosition.rotation;
      cars.push(aiCar);
      
      // Initialize AI driver
      const personalities = ['aggressive', 'balanced', 'defensive'];
      initializeAIDriver(aiCar.id, personalities[i % 3] as any);
    }

    updateGameData({
      cars,
      raceStartTime: Date.now() + 3000, // 3 second countdown
      lapStartTime: Date.now() + 3000,
      currentState: 'RACING',
    });

    // Countdown sounds
    setTimeout(() => generateCountdownBeep(false), 1000);
    setTimeout(() => generateCountdownBeep(false), 2000);
    setTimeout(() => generateCountdownBeep(true), 3000);
  };

  const updateGame = (deltaTime: number) => {
    const currentGameData = getGameData();
    
    if (currentGameData.currentState !== 'RACING' || currentGameData.isPaused) return;

    const now = Date.now();
    if (now < currentGameData.raceStartTime) return; // Still in countdown

    const cars = [...currentGameData.cars];
    
    // Update cars
    for (const car of cars) {
      if (car.isPlayer) {
        updateCarPhysics(car, keys, deltaTime);
        
        // Generate engine sound for player
        if (Math.abs(car.speed) > 0.5) {
          generateEngineSound(car.speed, car.maxSpeed);
        }
      } else {
        updateAI(car, track, cars, deltaTime);
      }

      // Check wall collisions
      if (checkWallCollision(car, track.boundaries)) {
        resolveWallCollision(car, track.boundaries);
        if (car.isPlayer) {
          generateCollisionSound();
        }
      }

      // Update lap progress
      const { progress, nextCheckpoint } = calculateLapProgress(
        car.x, 
        car.y, 
        track, 
        car.lastCheckpoint
      );

      if (nextCheckpoint !== car.lastCheckpoint) {
        car.lastCheckpoint = nextCheckpoint;
        car.lapProgress = progress;

        // Check if completed a lap
        if (nextCheckpoint === 0 && car.lapProgress > 0.9) {
          car.currentLap++;
          const lapTime = now - currentGameData.lapStartTime;
          car.lapTimes.push(lapTime);
          
          if (car.isPlayer) {
            updateGameData({ 
              lapStartTime: now,
              currentLapTime: 0,
              bestLapTime: Math.min(currentGameData.bestLapTime, lapTime)
            });
          }
        }
      }
    }

    // Handle car-to-car collisions
    for (let i = 0; i < cars.length; i++) {
      for (let j = i + 1; j < cars.length; j++) {
        if (checkCarCollision(cars[i], cars[j])) {
          resolveCarCollision(cars[i], cars[j]);
          generateCollisionSound();
        }
      }
    }

    // Update positions
    const sortedCars = cars.sort((a, b) => {
      if (a.currentLap !== b.currentLap) {
        return b.currentLap - a.currentLap;
      }
      return b.lapProgress - a.lapProgress;
    });

    sortedCars.forEach((car, index) => {
      car.position = index + 1;
    });

    const playerCar = cars.find(car => car.isPlayer);
    const playerPosition = playerCar?.position || 1;

    updateGameData({ 
      cars,
      playerPosition,
      currentLapTime: now - currentGameData.lapStartTime
    });

    // Check race finish
    if (playerCar && playerCar.currentLap >= track.laps) {
      const raceResults = {
        position: playerPosition,
        totalTime: now - currentGameData.raceStartTime,
        bestLap: currentGameData.bestLapTime,
        lapTimes: playerCar.lapTimes,
      };
      
      updateGameData({ 
        raceFinished: true,
        raceEndTime: now,
        totalRaceTime: now - currentGameData.raceStartTime
      });
      
      onRaceFinish(raceResults);
    }
  };

  const renderGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentGameData = getGameData();

    // Clear canvas
    ctx.fillStyle = '#2d5a3d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw track boundaries
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (const boundary of track.boundaries) {
      ctx.moveTo(boundary.x1, boundary.y1);
      ctx.lineTo(boundary.x2, boundary.y2);
    }
    ctx.stroke();

    // Draw checkpoints
    ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
    for (const checkpoint of track.checkpoints) {
      ctx.beginPath();
      ctx.arc(checkpoint.x, checkpoint.y, checkpoint.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw waypoints (for debugging)
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    for (const waypoint of track.waypoints) {
      ctx.beginPath();
      ctx.arc(waypoint.x, waypoint.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw cars
    for (const car of currentGameData.cars) {
      ctx.save();
      ctx.translate(car.x, car.y);
      ctx.rotate(car.rotation);

      // Car body
      ctx.fillStyle = car.color;
      ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);

      // Car outline
      ctx.strokeStyle = car.isPlayer ? '#ffff00' : '#000000';
      ctx.lineWidth = car.isPlayer ? 3 : 1;
      ctx.strokeRect(-car.width / 2, -car.height / 2, car.width, car.height);

      // Direction indicator
      ctx.fillStyle = '#000000';
      ctx.fillRect(car.width / 2 - 3, -2, 6, 4);

      ctx.restore();

      // Position indicator
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(car.position.toString(), car.x, car.y - 25);
    }

    // Draw countdown
    const now = Date.now();
    if (now < currentGameData.raceStartTime) {
      const countdown = Math.ceil((currentGameData.raceStartTime - now) / 1000);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '72px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        countdown > 0 ? countdown.toString() : 'GO!',
        canvas.width / 2,
        canvas.height / 2
      );
    }
  };

  useGameLoop(
    { update: updateGame, render: renderGame },
    gameData.currentState === 'RACING' && !gameData.isPaused
  );

  // Handle pause
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Escape' || event.code === 'Space') {
        onPause();
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onPause]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={track.width}
        height={track.height}
        className="border-2 border-gray-400 bg-green-800"
        style={{ 
          maxWidth: '100%', 
          maxHeight: '70vh', 
          objectFit: 'contain' 
        }}
      />
    </div>
  );
};