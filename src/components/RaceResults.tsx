'use client';

import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface RaceResultsProps {
  results: {
    position: number;
    totalTime: number;
    bestLap: number;
    lapTimes: number[];
  };
  trackName: string;
  onRestart: () => void;
  onNextTrack: () => void;
  onMainMenu: () => void;
}

export const RaceResults: React.FC<RaceResultsProps> = ({
  results,
  trackName,
  onRestart,
  onNextTrack,
  onMainMenu,
}) => {
  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = Math.floor((milliseconds % 1000) / 10);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const getPositionText = (position: number): string => {
    const suffix = ['th', 'st', 'nd', 'rd'];
    const v = position % 100;
    return position + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
  };

  const getPositionColor = (position: number): string => {
    switch (position) {
      case 1: return 'bg-yellow-500 text-black';
      case 2: return 'bg-gray-400 text-black';
      case 3: return 'bg-amber-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getResultMessage = (position: number): string => {
    switch (position) {
      case 1: return '🏆 Congratulations! You won!';
      case 2: return '🥈 Great job! Second place!';
      case 3: return '🥉 Well done! Third place!';
      case 4:
      case 5: return '👍 Good race! Keep pushing!';
      default: return '💪 Better luck next time!';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <Card className="w-[500px] bg-gray-900 text-white border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-yellow-400">Race Complete!</CardTitle>
          <div className="text-lg text-gray-300">{trackName}</div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Position Badge */}
          <div className="text-center">
            <Badge 
              className={`text-4xl px-6 py-3 font-bold ${getPositionColor(results.position)}`}
            >
              {getPositionText(results.position)} Place
            </Badge>
            <div className="text-lg text-gray-300 mt-2">
              {getResultMessage(results.position)}
            </div>
          </div>

          {/* Race Statistics */}
          <div className="grid grid-cols-2 gap-4 bg-gray-800 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-xs text-gray-400 uppercase">Total Time</div>
              <div className="text-xl font-bold text-blue-400">
                {formatTime(results.totalTime)}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-xs text-gray-400 uppercase">Best Lap</div>
              <div className="text-xl font-bold text-purple-400">
                {results.bestLap !== Infinity ? formatTime(results.bestLap) : '--:--.--'}
              </div>
            </div>
          </div>

          {/* Lap Times */}
          {results.lapTimes.length > 0 && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-sm text-gray-400 uppercase mb-2">Lap Times</div>
              <div className="space-y-1">
                {results.lapTimes.map((lapTime, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-300">Lap {index + 1}:</span>
                    <span className={lapTime === results.bestLap ? 'text-purple-400 font-bold' : 'text-white'}>
                      {formatTime(lapTime)}
                      {lapTime === results.bestLap && ' ⭐'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={onRestart}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
            >
              Race Again
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={onNextTrack}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Next Track
              </Button>
              
              <Button 
                onClick={onMainMenu}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Main Menu
              </Button>
            </div>
          </div>

          {/* Performance Tips */}
          <div className="text-xs text-gray-500 bg-gray-800 p-3 rounded">
            <div className="font-semibold mb-1">💡 Racing Tips:</div>
            <div>• Brake before turns, accelerate out of them</div>
            <div>• Use the racing line for optimal lap times</div>
            <div>• Watch for AI cars and plan your overtakes</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};