import { Car } from './gameState';

export interface CollisionResult {
  occurred: boolean;
  point?: { x: number; y: number };
  normal?: { x: number; y: number };
}

export const checkPointInPolygon = (
  point: { x: number; y: number }, 
  polygon: { x: number; y: number }[]
): boolean => {
  let inside = false;
  let j = polygon.length - 1;
  
  for (let i = 0; i < polygon.length; i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    
    if (((yi > point.y) !== (yj > point.y)) && 
        (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
    j = i;
  }
  
  return inside;
};

export const getCarBoundingBox = (car: Car): { x: number; y: number }[] => {
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

export const checkPolygonCollision = (
  poly1: { x: number; y: number }[], 
  poly2: { x: number; y: number }[]
): CollisionResult => {
  // Separating Axis Theorem (SAT) implementation
  const axes: { x: number; y: number }[] = [];
  
  // Get axes from both polygons
  const addAxes = (polygon: { x: number; y: number }[]) => {
    for (let i = 0; i < polygon.length; i++) {
      const j = (i + 1) % polygon.length;
      const edge = {
        x: polygon[j].x - polygon[i].x,
        y: polygon[j].y - polygon[i].y,
      };
      // Perpendicular axis
      axes.push({ x: -edge.y, y: edge.x });
    }
  };
  
  addAxes(poly1);
  addAxes(poly2);
  
  // Test each axis
  for (const axis of axes) {
    const length = Math.sqrt(axis.x * axis.x + axis.y * axis.y);
    if (length === 0) continue;
    
    const normalizedAxis = { x: axis.x / length, y: axis.y / length };
    
    const proj1 = projectPolygon(poly1, normalizedAxis);
    const proj2 = projectPolygon(poly2, normalizedAxis);
    
    if (proj1.max < proj2.min || proj2.max < proj1.min) {
      return { occurred: false };
    }
  }
  
  return { occurred: true };
};

const projectPolygon = (
  polygon: { x: number; y: number }[], 
  axis: { x: number; y: number }
): { min: number; max: number } => {
  let min = Infinity;
  let max = -Infinity;
  
  for (const vertex of polygon) {
    const dot = vertex.x * axis.x + vertex.y * axis.y;
    min = Math.min(min, dot);
    max = Math.max(max, dot);
  }
  
  return { min, max };
};

export const getLineIntersection = (
  line1: { x1: number; y1: number; x2: number; y2: number },
  line2: { x1: number; y1: number; x2: number; y2: number }
): { x: number; y: number } | null => {
  const denom = (line1.x1 - line1.x2) * (line2.y1 - line2.y2) - 
                (line1.y1 - line1.y2) * (line2.x1 - line2.x2);
  
  if (Math.abs(denom) < 1e-10) return null;
  
  const t = ((line1.x1 - line2.x1) * (line2.y1 - line2.y2) - 
             (line1.y1 - line2.y1) * (line2.x1 - line2.x2)) / denom;
  const u = -((line1.x1 - line1.x2) * (line1.y1 - line2.y1) - 
              (line1.y1 - line1.y2) * (line1.x1 - line2.x1)) / denom;
  
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return {
      x: line1.x1 + t * (line1.x2 - line1.x1),
      y: line1.y1 + t * (line1.y2 - line1.y1),
    };
  }
  
  return null;
};

export const getClosestPointOnLine = (
  point: { x: number; y: number },
  line: { x1: number; y1: number; x2: number; y2: number }
): { x: number; y: number; distance: number } => {
  const A = point.x - line.x1;
  const B = point.y - line.y1;
  const C = line.x2 - line.x1;
  const D = line.y2 - line.y1;
  
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  
  if (lenSq === 0) {
    const distance = Math.sqrt(A * A + B * B);
    return { x: line.x1, y: line.y1, distance };
  }
  
  let t = Math.max(0, Math.min(1, dot / lenSq));
  
  const projection = {
    x: line.x1 + t * C,
    y: line.y1 + t * D,
  };
  
  const distance = Math.sqrt(
    (point.x - projection.x) ** 2 + (point.y - projection.y) ** 2
  );
  
  return { ...projection, distance };
};