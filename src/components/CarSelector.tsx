'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CAR_COLORS } from '../lib/gameState';

interface CarSelectorProps {
  onSelectCar: (carColor: string) => void;
  onBack: () => void;
}

export const CarSelector: React.FC<CarSelectorProps> = ({
  onSelectCar,
  onBack,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>(CAR_COLORS[0]);

  const handleCarSelect = (color: string) => {
    setSelectedColor(color);
  };

  const handleConfirm = () => {
    onSelectCar(selectedColor);
  };

  const getColorName = (color: string): string => {
    const colorMap: { [key: string]: string } = {
      '#FF4444': 'Racing Red',
      '#4444FF': 'Ocean Blue',
      '#44FF44': 'Forest Green',
      '#FFFF44': 'Lightning Yellow',
      '#FF44FF': 'Purple Storm',
      '#44FFFF': 'Ice Cyan',
    };
    return colorMap[color] || 'Custom Color';
  };

  const getColorDescription = (color: string): string => {
    const descMap: { [key: string]: string } = {
      '#FF4444': 'Classic racing color for speed demons',
      '#4444FF': 'Cool and calculated, like the ocean depths',
      '#44FF44': 'Natural power from the forest',
      '#FFFF44': 'Electric energy and lightning reflexes',
      '#FF44FF': 'Mystical and unpredictable force',
      '#44FFFF': 'Cool precision and arctic focus',
    };
    return descMap[color] || 'Your unique racing machine';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Choose Your Car</h1>
          <p className="text-gray-400">Select your racing machine color scheme</p>
        </div>

        {/* Selected Car Preview */}
        <div className="bg-gray-800 rounded-lg p-8 mb-8 text-center border border-gray-700">
          <div className="mb-6">
            <div className="inline-block relative">
              {/* Car Preview */}
              <div 
                className="w-32 h-16 rounded-lg border-4 border-yellow-400 shadow-lg"
                style={{ backgroundColor: selectedColor }}
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-4 h-8 bg-black rounded-sm opacity-80"></div>
                </div>
                <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
                  <div className="w-6 h-4 bg-black rounded-sm"></div>
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            {getColorName(selectedColor)}
          </h2>
          <p className="text-gray-400 mb-4">
            {getColorDescription(selectedColor)}
          </p>
          
          {/* Car Stats Display */}
          <div className="grid grid-cols-3 gap-4 bg-gray-900 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-xs text-gray-400 uppercase">Top Speed</div>
              <div className="text-lg font-bold text-green-400">240 km/h</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400 uppercase">Acceleration</div>
              <div className="text-lg font-bold text-blue-400">8.5/10</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400 uppercase">Handling</div>
              <div className="text-lg font-bold text-purple-400">9.0/10</div>
            </div>
          </div>
        </div>

        {/* Color Selection Grid */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-center">Available Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {CAR_COLORS.map((color, index) => (
                <button
                  key={index}
                  onClick={() => handleCarSelect(color)}
                  className={`relative w-16 h-16 rounded-lg border-4 transition-all duration-200 hover:scale-110 ${
                    selectedColor === color
                      ? 'border-yellow-400 shadow-lg scale-110'
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Car mini preview */}
                  <div className="absolute bottom-1 right-1">
                    <div className="w-3 h-6 bg-black opacity-60 rounded-sm"></div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="text-center mt-4 text-sm text-gray-400">
              Click on any color to preview your racing car
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={onBack}
            variant="outline"
            className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3"
          >
            ← Back
          </Button>
          
          <Button 
            onClick={handleConfirm}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 font-semibold"
          >
            Start Racing! 🏁
          </Button>
        </div>

        {/* Racing Tips */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>🏎️ All cars have identical performance - choose the color that represents your racing spirit!</p>
        </div>
      </div>
    </div>
  );
};