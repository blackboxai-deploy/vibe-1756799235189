import { Car } from './gameState';

export interface KeyState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

const FRICTION = 0.92;
const ROTATION_SPEED = 0.08;
const MIN_SPEED_FOR_TURNING = 0.5;

export const updateCarPhysics = (car: Car, keys: KeyState, deltaTime: number): void => {
  // Handle input for player cars
  if (car.isPlayer && keys) {
    // Acceleration/Deceleration
    if (keys.up) {
      car.speed += car.acceleration * deltaTime;
    } else if (keys.down) {
      car.speed -= car.acceleration * 0.8 * deltaTime;
    }
    
    // Turning (only if moving fast enough)
    if (Math.abs(car.speed) > MIN_SPEED_FOR_TURNING) {
      if (keys.left) {
        car.rotation -= ROTATION_SPEED * (car.speed / car.maxSpeed) * deltaTime;
      }
      if (keys.right) {
        car.rotation += ROTATION_SPEED * (car.speed / car.maxSpeed) * deltaTime;
      }
    }
  }
  
  // Apply speed limits
  car.speed = Math.max(-car.maxSpeed * 0.5, Math.min(car.maxSpeed, car.speed));
  
  // Apply friction
  car.speed *= Math.pow(FRICTION, deltaTime);
  
  // Update position based on rotation and speed
  car.x += Math.cos(car.rotation) * car.speed * deltaTime;
  car.y += Math.sin(car.rotation) * car.speed * deltaTime;
  
  // Stop very slow movement to prevent jitter
  if (Math.abs(car.speed) < 0.01) {
    car.speed = 0;
  }
};

export const getCarCorners = (car: Car): { x: number; y: number }[] => {
  const cos = Math.cos(car.rotation);
  const sin = Math.sin(car.rotation);
  const halfWidth = car.width / 2;
  const halfHeight = car.height / 2;
  
  return [
    {
      x: car.x + cos * halfWidth - sin * halfHeight,
      y: car.y + sin * halfWidth + cos * halfHeight,
    },
    {
      x: car.x - cos * halfWidth - sin * halfHeight,
      y: car.y - sin * halfWidth + cos * halfHeight,
    },
    {
      x: car.x - cos * halfWidth + sin * halfHeight,
      y: car.y - sin * halfWidth - cos * halfHeight,
    },
    {
      x: car.x + cos * halfWidth + sin * halfHeight,
      y: car.y + sin * halfWidth - cos * halfHeight,
    },
  ];
};

export const checkCarCollision = (car1: Car, car2: Car): boolean => {
  const dx = car1.x - car2.x;
  const dy = car1.y - car2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const minDistance = (car1.width + car2.width) / 2;
  
  return distance < minDistance;
};

export const resolveCarCollision = (car1: Car, car2: Car): void => {
  const dx = car1.x - car2.x;
  const dy = car1.y - car2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance === 0) return;
  
  const overlap = (car1.width + car2.width) / 2 - distance;
  if (overlap > 0) {
    const separationX = (dx / distance) * overlap * 0.5;
    const separationY = (dy / distance) * overlap * 0.5;
    
    car1.x += separationX;
    car1.y += separationY;
    car2.x -= separationX;
    car2.y -= separationY;
    
    // Apply collision response to speeds
    const relativeVelX = car1.speed * Math.cos(car1.rotation) - car2.speed * Math.cos(car2.rotation);
    const relativeVelY = car1.speed * Math.sin(car1.rotation) - car2.speed * Math.sin(car2.rotation);
    const relativeSpeed = Math.sqrt(relativeVelX * relativeVelX + relativeVelY * relativeVelY);
    
    const speedReduction = Math.min(0.7, relativeSpeed * 0.1);
    car1.speed *= (1 - speedReduction);
    car2.speed *= (1 - speedReduction);
  }
};

export const checkWallCollision = (car: Car, boundaries: { x1: number; y1: number; x2: number; y2: number }[]): boolean => {
  const corners = getCarCorners(car);
  
  for (const corner of corners) {
    for (const boundary of boundaries) {
      if (pointToLineDistance(corner, boundary) < 2) {
        return true;
      }
    }
  }
  
  return false;
};

export const resolveWallCollision = (car: Car, boundaries: { x1: number; y1: number; x2: number; y2: number }[]): void => {
  const corners = getCarCorners(car);
  let collided = false;
  
  for (const corner of corners) {
    for (const boundary of boundaries) {
      const distance = pointToLineDistance(corner, boundary);
      if (distance < 5) {
        // Push car away from wall
        const normal = getLineNormal(boundary);
        car.x += normal.x * (5 - distance);
        car.y += normal.y * (5 - distance);
        
        // Reduce speed on collision
        car.speed *= 0.3;
        collided = true;
        break;
      }
    }
    if (collided) break;
  }
};

const pointToLineDistance = (point: { x: number; y: number }, line: { x1: number; y1: number; x2: number; y2: number }): number => {
  const A = point.x - line.x1;
  const B = point.y - line.y1;
  const C = line.x2 - line.x1;
  const D = line.y2 - line.y1;
  
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  
  if (lenSq === 0) return Math.sqrt(A * A + B * B);
  
  let t = Math.max(0, Math.min(1, dot / lenSq));
  
  const projection = { x: line.x1 + t * C, y: line.y1 + t * D };
  
  return Math.sqrt((point.x - projection.x) ** 2 + (point.y - projection.y) ** 2);
};

const getLineNormal = (line: { x1: number; y1: number; x2: number; y2: number }): { x: number; y: number } => {
  const dx = line.x2 - line.x1;
  const dy = line.y2 - line.y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  return { x: -dy / length, y: dx / length };
};