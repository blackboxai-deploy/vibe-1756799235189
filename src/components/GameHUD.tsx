'use client';

import React from 'react';
import { getGameData } from '../lib/gameState';

export const GameHUD: React.FC = () => {
  const gameData = getGameData();
  const playerCar = gameData.cars.find(car => car.isPlayer);

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = Math.floor((milliseconds % 1000) / 10);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const formatSpeed = (speed: number): string => {
    return Math.round(Math.abs(speed) * 10).toString();
  };

  if (!playerCar || gameData.currentState !== 'RACING') {
    return null;
  }

  return (
    <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg font-mono text-sm">
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-2">
          <div className="text-xs text-gray-300">POSITION</div>
          <div className="text-2xl font-bold text-yellow-400">
            {gameData.playerPosition}/{gameData.cars.length}
          </div>
          
          <div className="text-xs text-gray-300">LAP</div>
          <div className="text-lg font-bold">
            {playerCar.currentLap}/{gameData.selectedTrack?.laps || 3}
          </div>
          
          <div className="text-xs text-gray-300">SPEED</div>
          <div className="text-lg font-bold text-green-400">
            {formatSpeed(playerCar.speed)} km/h
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-2">
          <div className="text-xs text-gray-300">CURRENT LAP</div>
          <div className="text-lg font-bold text-blue-400">
            {formatTime(gameData.currentLapTime)}
          </div>
          
          <div className="text-xs text-gray-300">BEST LAP</div>
          <div className="text-lg font-bold text-purple-400">
            {gameData.bestLapTime !== Infinity ? formatTime(gameData.bestLapTime) : '--:--.--'}
          </div>
          
          <div className="text-xs text-gray-300">TOTAL TIME</div>
          <div className="text-lg font-bold">
            {formatTime(Date.now() - gameData.raceStartTime)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="text-xs text-gray-300 mb-1">LAP PROGRESS</div>
        <div className="w-full bg-gray-700 h-2 rounded">
          <div 
            className="bg-yellow-400 h-2 rounded transition-all duration-200"
            style={{ width: `${(playerCar.lapProgress || 0) * 100}%` }}
          />
        </div>
      </div>

      {/* Controls hint */}
      <div className="mt-4 text-xs text-gray-400">
        <div>WASD / Arrow Keys: Move</div>
        <div>ESC / Space: Pause</div>
      </div>
    </div>
  );
};

// Minimap component
export const MiniMap: React.FC = () => {
  const gameData = getGameData();
  
  if (!gameData.selectedTrack) return null;

  const scale = 0.15;
  const track = gameData.selectedTrack;
  const mapWidth = track.width * scale;
  const mapHeight = track.height * scale;

  return (
    <div className="absolute top-4 right-4 bg-black bg-opacity-70 p-2 rounded-lg">
      <div className="text-white text-xs mb-2 text-center">MINIMAP</div>
      <svg 
        width={mapWidth} 
        height={mapHeight} 
        className="border border-gray-500"
        style={{ backgroundColor: '#2d5a3d' }}
      >
        {/* Track boundaries */}
        {track.boundaries.map((boundary, index) => (
          <line
            key={index}
            x1={boundary.x1 * scale}
            y1={boundary.y1 * scale}
            x2={boundary.x2 * scale}
            y2={boundary.y2 * scale}
            stroke="white"
            strokeWidth="1"
          />
        ))}
        
        {/* Cars */}
        {gameData.cars.map((car, index) => (
          <circle
            key={index}
            cx={car.x * scale}
            cy={car.y * scale}
            r={car.isPlayer ? 3 : 2}
            fill={car.isPlayer ? '#ffff00' : car.color}
            stroke={car.isPlayer ? '#000' : 'none'}
            strokeWidth="1"
          />
        ))}
      </svg>
    </div>
  );
};