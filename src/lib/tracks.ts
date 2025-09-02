import { Track } from './gameState';

export const TRACKS: Track[] = [
  {
    id: 'oval',
    name: 'Speedway Oval',
    difficulty: 'Easy',
    width: 800,
    height: 600,
    laps: 3,
    startPosition: { x: 200, y: 300, rotation: 0 },
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ca3a843c-570f-4036-a701-04c057cf3bdc.png',
    checkpoints: [
      { x: 200, y: 300, radius: 30 }, // Start/Finish
      { x: 600, y: 150, radius: 30 }, // Turn 1
      { x: 600, y: 450, radius: 30 }, // Turn 2
      { x: 200, y: 450, radius: 30 }, // Turn 3
    ],
    waypoints: [
      { x: 200, y: 300 },
      { x: 400, y: 200 },
      { x: 600, y: 150 },
      { x: 650, y: 300 },
      { x: 600, y: 450 },
      { x: 400, y: 500 },
      { x: 200, y: 450 },
      { x: 150, y: 300 },
    ],
    boundaries: [
      // Outer boundaries
      { x1: 100, y1: 100, x2: 700, y2: 100 },
      { x1: 700, y1: 100, x2: 700, y2: 500 },
      { x1: 700, y1: 500, x2: 100, y2: 500 },
      { x1: 100, y1: 500, x2: 100, y2: 100 },
      // Inner boundaries
      { x1: 250, y1: 200, x2: 550, y2: 200 },
      { x1: 550, y1: 200, x2: 550, y2: 400 },
      { x1: 550, y1: 400, x2: 250, y2: 400 },
      { x1: 250, y1: 400, x2: 250, y2: 200 },
    ],
  },
  {
    id: 'circuit',
    name: 'Grand Prix Circuit',
    difficulty: 'Medium',
    width: 900,
    height: 700,
    laps: 3,
    startPosition: { x: 150, y: 350, rotation: 0 },
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/4e9c226e-0214-4cb0-a860-8dbeb6575601.png',
    checkpoints: [
      { x: 150, y: 350, radius: 25 }, // Start/Finish
      { x: 450, y: 200, radius: 25 }, // Sector 1
      { x: 750, y: 300, radius: 25 }, // Sector 2
      { x: 600, y: 550, radius: 25 }, // Sector 3
      { x: 300, y: 500, radius: 25 }, // Sector 4
    ],
    waypoints: [
      { x: 150, y: 350 },
      { x: 300, y: 250 },
      { x: 450, y: 200 },
      { x: 600, y: 250 },
      { x: 750, y: 300 },
      { x: 700, y: 450 },
      { x: 600, y: 550 },
      { x: 450, y: 550 },
      { x: 300, y: 500 },
      { x: 200, y: 450 },
      { x: 150, y: 350 },
    ],
    boundaries: [
      // Outer track boundaries
      { x1: 50, y1: 150, x2: 500, y2: 100 },
      { x1: 500, y1: 100, x2: 700, y2: 150 },
      { x1: 700, y1: 150, x2: 800, y2: 250 },
      { x1: 800, y1: 250, x2: 800, y2: 400 },
      { x1: 800, y1: 400, x2: 750, y2: 500 },
      { x1: 750, y1: 500, x2: 650, y2: 600 },
      { x1: 650, y1: 600, x2: 400, y2: 600 },
      { x1: 400, y1: 600, x2: 200, y2: 550 },
      { x1: 200, y1: 550, x2: 100, y2: 500 },
      { x1: 100, y1: 500, x2: 50, y2: 400 },
      { x1: 50, y1: 400, x2: 50, y2: 150 },
      // Inner track boundaries
      { x1: 200, y1: 250, x2: 400, y2: 200 },
      { x1: 400, y1: 200, x2: 550, y2: 250 },
      { x1: 550, y1: 250, x2: 600, y2: 350 },
      { x1: 600, y1: 350, x2: 550, y2: 450 },
      { x1: 550, y1: 450, x2: 400, y2: 450 },
      { x1: 400, y1: 450, x2: 250, y2: 400 },
      { x1: 250, y1: 400, x2: 200, y2: 350 },
      { x1: 200, y1: 350, x2: 200, y2: 250 },
    ],
  },
  {
    id: 'mountain',
    name: 'Mountain Pass',
    difficulty: 'Hard',
    width: 1000,
    height: 800,
    laps: 2,
    startPosition: { x: 100, y: 400, rotation: 0 },
    image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/483694c8-d0b2-4376-9776-ded2881fc745.png',
    checkpoints: [
      { x: 100, y: 400, radius: 20 }, // Start/Finish
      { x: 300, y: 200, radius: 20 }, // Hairpin 1
      { x: 600, y: 150, radius: 20 }, // Straight section
      { x: 850, y: 300, radius: 20 }, // Mountain peak
      { x: 700, y: 600, radius: 20 }, // Descent
      { x: 400, y: 650, radius: 20 }, // Valley turn
      { x: 200, y: 500, radius: 20 }, // Final sector
    ],
    waypoints: [
      { x: 100, y: 400 },
      { x: 200, y: 300 },
      { x: 300, y: 200 },
      { x: 450, y: 180 },
      { x: 600, y: 150 },
      { x: 750, y: 200 },
      { x: 850, y: 300 },
      { x: 800, y: 450 },
      { x: 700, y: 600 },
      { x: 550, y: 650 },
      { x: 400, y: 650 },
      { x: 250, y: 600 },
      { x: 200, y: 500 },
      { x: 150, y: 450 },
    ],
    boundaries: [
      // Complex mountain track boundaries
      { x1: 50, y1: 350, x2: 150, y2: 250 },
      { x1: 150, y1: 250, x2: 250, y2: 150 },
      { x1: 250, y1: 150, x2: 400, y2: 120 },
      { x1: 400, y1: 120, x2: 650, y2: 100 },
      { x1: 650, y1: 100, x2: 800, y2: 150 },
      { x1: 800, y1: 150, x2: 900, y2: 250 },
      { x1: 900, y1: 250, x2: 900, y2: 350 },
      { x1: 900, y1: 350, x2: 850, y2: 450 },
      { x1: 850, y1: 450, x2: 750, y2: 550 },
      { x1: 750, y1: 550, x2: 750, y2: 650 },
      { x1: 750, y1: 650, x2: 650, y2: 700 },
      { x1: 650, y1: 700, x2: 350, y2: 700 },
      { x1: 350, y1: 700, x2: 200, y2: 650 },
      { x1: 200, y1: 650, x2: 150, y2: 550 },
      { x1: 150, y1: 550, x2: 100, y2: 450 },
      { x1: 100, y1: 450, x2: 50, y2: 350 },
      // Inner boundaries (tighter curves)
      { x1: 150, y1: 350, x2: 200, y2: 300 },
      { x1: 200, y1: 300, x2: 300, y2: 250 },
      { x1: 300, y1: 250, x2: 450, y2: 230 },
      { x1: 450, y1: 230, x2: 600, y2: 200 },
      { x1: 600, y1: 200, x2: 750, y2: 250 },
      { x1: 750, y1: 250, x2: 800, y2: 350 },
      { x1: 800, y1: 350, x2: 750, y2: 450 },
      { x1: 750, y1: 450, x2: 650, y2: 550 },
      { x1: 650, y1: 550, x2: 550, y2: 600 },
      { x1: 550, y1: 600, x2: 350, y2: 600 },
      { x1: 350, y1: 600, x2: 250, y2: 550 },
      { x1: 250, y1: 550, x2: 200, y2: 450 },
      { x1: 200, y1: 450, x2: 150, y2: 350 },
    ],
  },
];

export const getTrackById = (id: string): Track | null => {
  return TRACKS.find(track => track.id === id) || null;
};

export const checkCheckpoint = (
  carX: number,
  carY: number,
  checkpoint: { x: number; y: number; radius: number }
): boolean => {
  const dx = carX - checkpoint.x;
  const dy = carY - checkpoint.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance <= checkpoint.radius;
};

export const calculateLapProgress = (
  carX: number,
  carY: number,
  track: Track,
  lastCheckpoint: number
): { progress: number; nextCheckpoint: number } => {
  const checkpoints = track.checkpoints;
  let progress = 0;
  let nextCheckpoint = lastCheckpoint + 1;
  
  if (nextCheckpoint >= checkpoints.length) {
    nextCheckpoint = 0;
  }
  
  // Check if car has reached the next checkpoint
  if (checkCheckpoint(carX, carY, checkpoints[nextCheckpoint])) {
    progress = nextCheckpoint / checkpoints.length;
    return { progress, nextCheckpoint };
  }
  
  // Calculate intermediate progress based on distance to next checkpoint
  const currentCheckpoint = lastCheckpoint >= 0 ? checkpoints[lastCheckpoint] : checkpoints[0];
  const targetCheckpoint = checkpoints[nextCheckpoint];
  
  const totalDistance = Math.sqrt(
    (targetCheckpoint.x - currentCheckpoint.x) ** 2 +
    (targetCheckpoint.y - currentCheckpoint.y) ** 2
  );
  
  const remainingDistance = Math.sqrt(
    (targetCheckpoint.x - carX) ** 2 +
    (targetCheckpoint.y - carY) ** 2
  );
  
  const segmentProgress = Math.max(0, Math.min(1, 1 - remainingDistance / totalDistance));
  progress = (lastCheckpoint + segmentProgress) / checkpoints.length;
  
  return { progress, nextCheckpoint: lastCheckpoint };
};