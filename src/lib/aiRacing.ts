import { Car, Track } from './gameState';
import { updateCarPhysics, KeyState } from './carPhysics';

export type AIPersonality = 'aggressive' | 'balanced' | 'defensive';

export interface AIDriver {
  personality: AIPersonality;
  skill: number; // 0.5 to 1.0
  targetWaypointIndex: number;
  stuckTimer: number;
  lastPosition: { x: number; y: number };
  overtakeTimer: number;
  reactionTime: number;
}

const AI_DRIVERS: Map<string, AIDriver> = new Map();

export const initializeAIDriver = (carId: string, personality: AIPersonality = 'balanced'): void => {
  const skill = 0.6 + Math.random() * 0.3; // Random skill between 0.6-0.9
  
  AI_DRIVERS.set(carId, {
    personality,
    skill,
    targetWaypointIndex: 0,
    stuckTimer: 0,
    lastPosition: { x: 0, y: 0 },
    overtakeTimer: 0,
    reactionTime: (1 - skill) * 200 + Math.random() * 100, // 100-300ms reaction time
  });
};

export const updateAI = (car: Car, track: Track, allCars: Car[], deltaTime: number): void => {
  const aiDriver = AI_DRIVERS.get(car.id);
  if (!aiDriver || car.isPlayer) return;
  
  // Check if AI is stuck
  const distanceMoved = Math.sqrt(
    (car.x - aiDriver.lastPosition.x) ** 2 + 
    (car.y - aiDriver.lastPosition.y) ** 2
  );
  
  if (distanceMoved < 1 && Math.abs(car.speed) < 0.5) {
    aiDriver.stuckTimer += deltaTime;
  } else {
    aiDriver.stuckTimer = 0;
    aiDriver.lastPosition = { x: car.x, y: car.y };
  }
  
  // Get AI input based on current situation
  const aiInput = calculateAIInput(car, track, allCars, aiDriver, deltaTime);
  
  // Apply physics with AI input
  updateCarPhysics(car, aiInput, deltaTime);
  
  // Update target waypoint
  updateTargetWaypoint(car, track, aiDriver);
};

const calculateAIInput = (
  car: Car, 
  track: Track, 
  allCars: Car[], 
  aiDriver: AIDriver, 
  deltaTime: number
): KeyState => {
  const input: KeyState = { up: false, down: false, left: false, right: false };
  
  // Get target waypoint
  const targetWaypoint = track.waypoints[aiDriver.targetWaypointIndex];
  if (!targetWaypoint) return input;
  
  // Calculate angle to target
  const dx = targetWaypoint.x - car.x;
  const dy = targetWaypoint.y - car.y;
  const targetAngle = Math.atan2(dy, dx);
  
  // Calculate angle difference
  let angleDiff = targetAngle - car.rotation;
  
  // Normalize angle difference
  while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
  while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
  
  // Steering decision
  const steerThreshold = 0.1 * aiDriver.skill;
  if (angleDiff > steerThreshold) {
    input.right = true;
  } else if (angleDiff < -steerThreshold) {
    input.left = true;
  }
  
  // Speed decision
  const optimalSpeed = calculateOptimalSpeed(car, track, targetWaypoint, aiDriver);
  
  // Handle obstacles and other cars
  const obstacle = detectObstacles(car, allCars, track, aiDriver);
  
  if (obstacle.action === 'brake') {
    input.down = true;
  } else if (obstacle.action === 'avoid') {
    if (obstacle.direction === 'left') {
      input.left = true;
    } else if (obstacle.direction === 'right') {
      input.right = true;
    }
  }
  
  // Acceleration decision
  if (car.speed < optimalSpeed && !input.down) {
    input.up = true;
  } else if (car.speed > optimalSpeed * 1.2) {
    input.down = true;
  }
  
  // Handle being stuck
  if (aiDriver.stuckTimer > 1000) {
    input.down = true; // Reverse
    if (Math.random() > 0.5) {
      input.left = true;
    } else {
      input.right = true;
    }
  }
  
  // Apply personality traits
  applyPersonalityTraits(input, aiDriver, car, allCars);
  
  return input;
};

const calculateOptimalSpeed = (
  car: Car, 
  track: Track, 
  targetWaypoint: { x: number; y: number }, 
  aiDriver: AIDriver
): number => {
  // Base speed calculation
  let optimalSpeed = car.maxSpeed * aiDriver.skill;
  
  // Look ahead for turns
  const lookaheadWaypoint = track.waypoints[
    (aiDriver.targetWaypointIndex + 2) % track.waypoints.length
  ];
  
  if (lookaheadWaypoint) {
    const dx1 = targetWaypoint.x - car.x;
    const dy1 = targetWaypoint.y - car.y;
    const dx2 = lookaheadWaypoint.x - targetWaypoint.x;
    const dy2 = lookaheadWaypoint.y - targetWaypoint.y;
    
    // Calculate turn sharpness
    const angle1 = Math.atan2(dy1, dx1);
    const angle2 = Math.atan2(dy2, dx2);
    let turnAngle = Math.abs(angle2 - angle1);
    
    while (turnAngle > Math.PI) turnAngle -= 2 * Math.PI;
    turnAngle = Math.abs(turnAngle);
    
    // Reduce speed for sharp turns
    if (turnAngle > Math.PI / 4) {
      optimalSpeed *= 0.6;
    } else if (turnAngle > Math.PI / 6) {
      optimalSpeed *= 0.8;
    }
  }
  
  return optimalSpeed;
};

const detectObstacles = (
  car: Car, 
  allCars: Car[], 
  track: Track, 
  aiDriver: AIDriver
): { action: 'none' | 'brake' | 'avoid'; direction?: 'left' | 'right' } => {
  // Check for cars ahead
  const lookAheadDistance = 50;
  const carDirection = { x: Math.cos(car.rotation), y: Math.sin(car.rotation) };
  
  for (const otherCar of allCars) {
    if (otherCar.id === car.id) continue;
    
    const dx = otherCar.x - car.x;
    const dy = otherCar.y - car.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < lookAheadDistance) {
      // Check if the other car is in front
      const dotProduct = dx * carDirection.x + dy * carDirection.y;
      
      if (dotProduct > 0 && distance < 40) {
        // Determine avoidance direction
        const crossProduct = dx * carDirection.y - dy * carDirection.x;
        const direction = crossProduct > 0 ? 'left' : 'right';
        
        // Personality affects response
        if (aiDriver.personality === 'aggressive' && distance > 25) {
          return { action: 'avoid', direction };
        } else if (aiDriver.personality === 'defensive' || distance < 30) {
          return { action: 'brake' };
        } else {
          return { action: 'avoid', direction };
        }
      }
    }
  }
  
  return { action: 'none' };
};

const applyPersonalityTraits = (
  input: KeyState, 
  aiDriver: AIDriver, 
  car: Car, 
  allCars: Car[]
): void => {
  switch (aiDriver.personality) {
    case 'aggressive':
      // More likely to maintain high speeds and overtake
      if (input.down && car.speed > car.maxSpeed * 0.7) {
        input.down = Math.random() > 0.3; // 30% chance to ignore braking
      }
      break;
      
    case 'defensive':
      // More cautious, earlier braking
      if (car.speed > car.maxSpeed * 0.8) {
        input.up = false;
        if (Math.random() > 0.7) {
          input.down = true;
        }
      }
      break;
      
    case 'balanced':
      // Standard behavior, already implemented above
      break;
  }
  
  // Add some randomness for more realistic behavior
  if (Math.random() < 0.02) { // 2% chance per frame
    const randomAction = Math.random();
    if (randomAction < 0.3) {
      input.left = !input.left;
    } else if (randomAction < 0.6) {
      input.right = !input.right;
    } else if (randomAction < 0.8) {
      input.up = !input.up;
    }
  }
};

const updateTargetWaypoint = (car: Car, track: Track, aiDriver: AIDriver): void => {
  const currentWaypoint = track.waypoints[aiDriver.targetWaypointIndex];
  if (!currentWaypoint) return;
  
  const dx = currentWaypoint.x - car.x;
  const dy = currentWaypoint.y - car.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Move to next waypoint when close enough
  const waypointRadius = 25;
  if (distance < waypointRadius) {
    aiDriver.targetWaypointIndex = (aiDriver.targetWaypointIndex + 1) % track.waypoints.length;
  }
};

export const getAIDriver = (carId: string): AIDriver | undefined => {
  return AI_DRIVERS.get(carId);
};

export const removeAIDriver = (carId: string): void => {
  AI_DRIVERS.delete(carId);
};