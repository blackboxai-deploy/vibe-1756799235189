'use client';

import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  onResume,
  onRestart,
  onMainMenu,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <Card className="w-96 bg-gray-900 text-white border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-yellow-400">Game Paused</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={onResume}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
          >
            Resume Race
          </Button>
          
          <Button 
            onClick={onRestart}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 py-3"
          >
            Restart Race
          </Button>
          
          <Button 
            onClick={onMainMenu}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 py-3"
          >
            Main Menu
          </Button>

          <div className="text-sm text-gray-400 text-center mt-6">
            <div className="mb-2 font-semibold">Controls:</div>
            <div className="space-y-1">
              <div>WASD or Arrow Keys - Move car</div>
              <div>ESC or Space - Pause/Resume</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};