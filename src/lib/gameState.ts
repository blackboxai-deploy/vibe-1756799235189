export type GameState = 'MENU' | 'TRACK_SELECT' | 'CAR_SELECT' | 'RACING' | 'PAUSED' | 'FINISHED';

export interface Car {
  id: string;
  x: number;
  y: number;
  rotation: number;
  speed: number;
  maxSpeed: number;
  acceleration: number;
  handling: number;
  width: number;
  height: number;
  color: string;
  isPlayer: boolean;
  currentLap: number;
  lapProgress: number;
  position: number;
  lastCheckpoint: number;
  lapTimes: number[];
}

export interface Track {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  width: number;
  height: number;
  startPosition: { x: number; y: number; rotation: number };
  checkpoints: { x: number; y: number; radius: number }[];
  boundaries: { x1: number; y1: number; x2: number; y2: number }[];
  waypoints: { x: number; y: number }[];
  laps: number;
  image?: string;
}

export interface GameData {
  currentState: GameState;
  selectedTrack: Track | null;
  selectedCar: string;
  cars: Car[];
  raceStartTime: number;
  raceEndTime: number;
  isPaused: boolean;
  raceFinished: boolean;
  playerPosition: number;
  totalRaceTime: number;
  bestLapTime: number;
  currentLapTime: number;
  lapStartTime: number;
}

export const DEFAULT_CAR_STATS = {
  width: 20,
  height: 10,
  maxSpeed: 8,
  acceleration: 0.3,
  handling: 0.15,
  friction: 0.92,
};

export const CAR_COLORS = [
  '#FF4444', // Red (Player default)
  '#4444FF', // Blue
  '#44FF44', // Green
  '#FFFF44', // Yellow
  '#FF44FF', // Purple
  '#44FFFF', // Cyan
];

let gameData: GameData = {
  currentState: 'MENU',
  selectedTrack: null,
  selectedCar: CAR_COLORS[0],
  cars: [],
  raceStartTime: 0,
  raceEndTime: 0,
  isPaused: false,
  raceFinished: false,
  playerPosition: 1,
  totalRaceTime: 0,
  bestLapTime: Infinity,
  currentLapTime: 0,
  lapStartTime: 0,
};

export const getGameData = (): GameData => gameData;

export const updateGameData = (updates: Partial<GameData>): void => {
  gameData = { ...gameData, ...updates };
};

export const resetGameData = (): void => {
  gameData = {
    currentState: 'MENU',
    selectedTrack: null,
    selectedCar: CAR_COLORS[0],
    cars: [],
    raceStartTime: 0,
    raceEndTime: 0,
    isPaused: false,
    raceFinished: false,
    playerPosition: 1,
    totalRaceTime: 0,
    bestLapTime: Infinity,
    currentLapTime: 0,
    lapStartTime: 0,
  };
};

export const createCar = (
  id: string,
  x: number,
  y: number,
  color: string,
  isPlayer: boolean = false
): Car => ({
  id,
  x,
  y,
  rotation: 0,
  speed: 0,
  maxSpeed: DEFAULT_CAR_STATS.maxSpeed + (Math.random() - 0.5) * 2,
  acceleration: DEFAULT_CAR_STATS.acceleration + (Math.random() - 0.5) * 0.1,
  handling: DEFAULT_CAR_STATS.handling + (Math.random() - 0.5) * 0.05,
  width: DEFAULT_CAR_STATS.width,
  height: DEFAULT_CAR_STATS.height,
  color,
  isPlayer,
  currentLap: 0,
  lapProgress: 0,
  position: 1,
  lastCheckpoint: -1,
  lapTimes: [],
});