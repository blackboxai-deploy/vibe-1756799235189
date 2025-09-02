'use client';

import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { GameEngine } from '../components/GameEngine';
import { GameHUD, MiniMap } from '../components/GameHUD';
import { PauseMenu } from '../components/PauseMenu';
import { RaceResults } from '../components/RaceResults';
import { TrackSelector } from '../components/TrackSelector';
import { CarSelector } from '../components/CarSelector';
import { getGameData, updateGameData, resetGameData } from '../lib/gameState';
import { getTrackById, TRACKS } from '../lib/tracks';
import type { GameState } from '../lib/gameState';

export default function RacingGame() {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [selectedCarColor, setSelectedCarColor] = useState<string>('#FF4444');
  const [raceResults, setRaceResults] = useState<any>(null);
  const [showPause, setShowPause] = useState(false);

  const gameData = getGameData();

  const handleStartGame = () => {
    setGameState('TRACK_SELECT');
  };

  const handleSelectTrack = (trackId: string) => {
    setSelectedTrackId(trackId);
    const track = getTrackById(trackId);
    if (track) {
      updateGameData({ selectedTrack: track });
      setGameState('CAR_SELECT');
    }
  };

  const handleSelectCar = (carColor: string) => {
    setSelectedCarColor(carColor);
    updateGameData({ selectedCar: carColor });
    setGameState('RACING');
    setShowPause(false);
  };

  const handleRaceFinish = (results: any) => {
    setRaceResults(results);
    setGameState('FINISHED');
  };

  const handlePause = () => {
    updateGameData({ isPaused: true });
    setShowPause(true);
  };

  const handleResume = () => {
    updateGameData({ isPaused: false });
    setShowPause(false);
  };

  const handleRestart = () => {
    resetGameData();
    if (selectedTrackId) {
      const track = getTrackById(selectedTrackId);
      if (track) {
        updateGameData({ 
          selectedTrack: track,
          selectedCar: selectedCarColor 
        });
      }
    }
    setGameState('RACING');
    setShowPause(false);
    setRaceResults(null);
  };

  const handleMainMenu = () => {
    resetGameData();
    setGameState('MENU');
    setSelectedTrackId(null);
    setSelectedCarColor('#FF4444');
    setRaceResults(null);
    setShowPause(false);
  };

  const handleNextTrack = () => {
    if (selectedTrackId) {
      const currentIndex = TRACKS.findIndex(track => track.id === selectedTrackId);
      const nextIndex = (currentIndex + 1) % TRACKS.length;
      const nextTrack = TRACKS[nextIndex];
      
      setSelectedTrackId(nextTrack.id);
      updateGameData({ selectedTrack: nextTrack });
      handleRestart();
    }
  };

  const renderMainMenu = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-4xl w-full">
        {/* Game Title */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-4">
            🏎️ SPEED RACER 2D
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            High-Speed Racing Action
          </p>
          <p className="text-gray-400">
            Experience the thrill of competitive racing with AI opponents
          </p>
        </div>

        {/* Game Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-center">
                🏁 Multiple Tracks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm">
                Race on 3 unique circuits with varying difficulty levels from easy ovals to challenging mountain passes.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-center">
                🤖 Smart AI Opponents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm">
                Compete against 5 AI drivers with different racing personalities and skill levels for realistic competition.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-center">
                ⚡ Realistic Physics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm">
                Experience authentic car handling with acceleration, braking, and collision physics for immersive racing.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Menu Actions */}
        <div className="space-y-4">
          <Button 
            onClick={handleStartGame}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-12 text-xl rounded-lg transform hover:scale-105 transition-all duration-200"
          >
            🚀 Start Racing
          </Button>

          <div className="text-sm text-gray-500 mt-8">
            <div className="mb-4 font-semibold text-white">🎮 Controls:</div>
            <div className="grid grid-cols-2 gap-4 text-left max-w-md mx-auto">
              <div>WASD or Arrow Keys</div>
              <div>Move car</div>
              <div>ESC or Space</div>
              <div>Pause game</div>
            </div>
          </div>
        </div>

        {/* Game Stats */}
        <div className="mt-12 text-gray-500 text-sm">
          <div className="border-t border-gray-700 pt-6">
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{TRACKS.length}</div>
                <div>Race Tracks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">5</div>
                <div>AI Opponents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">6</div>
                <div>Car Colors</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render appropriate screen based on game state
  switch (gameState) {
    case 'MENU':
      return renderMainMenu();
    
    case 'TRACK_SELECT':
      return (
        <TrackSelector
          onSelectTrack={handleSelectTrack}
          onBack={handleMainMenu}
        />
      );
    
    case 'CAR_SELECT':
      return (
        <CarSelector
          onSelectCar={handleSelectCar}
          onBack={() => setGameState('TRACK_SELECT')}
        />
      );
    
    case 'RACING':
      const selectedTrack = gameData.selectedTrack;
      if (!selectedTrack) {
        return <div>Loading...</div>;
      }
      
      return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
          <div className="relative">
            <GameEngine
              track={selectedTrack}
              onRaceFinish={handleRaceFinish}
              onPause={handlePause}
            />
            
            <GameHUD />
            <MiniMap />
            
            {showPause && (
              <PauseMenu
                onResume={handleResume}
                onRestart={handleRestart}
                onMainMenu={handleMainMenu}
              />
            )}
          </div>
        </div>
      );
    
    case 'FINISHED':
      return (
        <>
          {raceResults && (
            <RaceResults
              results={raceResults}
              trackName={gameData.selectedTrack?.name || 'Unknown Track'}
              onRestart={handleRestart}
              onNextTrack={handleNextTrack}
              onMainMenu={handleMainMenu}
            />
          )}
        </>
      );
    
    default:
      return renderMainMenu();
  }
}