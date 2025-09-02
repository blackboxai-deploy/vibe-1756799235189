'use client';

import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TRACKS } from '../lib/tracks';

interface TrackSelectorProps {
  onSelectTrack: (trackId: string) => void;
  onBack: () => void;
}

export const TrackSelector: React.FC<TrackSelectorProps> = ({
  onSelectTrack,
  onBack,
}) => {
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyStars = (difficulty: string): string => {
    switch (difficulty) {
      case 'Easy': return '⭐';
      case 'Medium': return '⭐⭐';
      case 'Hard': return '⭐⭐⭐';
      default: return '⭐';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Select Race Track</h1>
          <p className="text-gray-400">Choose your racing circuit</p>
        </div>

        {/* Track Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {TRACKS.map((track) => (
            <Card 
              key={track.id}
              className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-300 cursor-pointer group hover:scale-105"
              onClick={() => onSelectTrack(track.id)}
            >
              <CardHeader className="pb-4">
                <div className="aspect-video bg-gray-700 rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={track.image || 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/0c40bc0e-abc8-427c-b7f3-de9b222233a7.png'}
                    alt={`${track.name} preview`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardTitle className="text-white text-xl">{track.name}</CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <Badge className={`${getDifficultyColor(track.difficulty)} text-white font-semibold`}>
                    {track.difficulty} {getDifficultyStars(track.difficulty)}
                  </Badge>
                  <span className="text-sm text-gray-400">{track.laps} Laps</span>
                </div>

                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Track Size:</span>
                    <span>{track.width} × {track.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Checkpoints:</span>
                    <span>{track.checkpoints.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Turns:</span>
                    <span>{track.waypoints.length}</span>
                  </div>
                </div>

                <Button 
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTrack(track.id);
                  }}
                >
                  Race This Track
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Button 
            onClick={onBack}
            variant="outline"
            className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3"
          >
            ← Back to Menu
          </Button>
        </div>

        {/* Track Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>💡 Pro Tip: Start with Easy tracks to learn the controls, then progress to harder circuits!</p>
        </div>
      </div>
    </div>
  );
};