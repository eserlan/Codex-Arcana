export interface RulerTick {
  year: number;
  pos: number;
  isMajor: boolean;
}

export interface EraRegion {
  id: string;
  name: string;
  startPos: number;
  endPos: number;
  color?: string;
}

/**
 * Calculates tick marks for a timeline ruler.
 */
export function getRulerTicks(minYear: number, maxYear: number, scale: number): RulerTick[] {
  const ticks: RulerTick[] = [];
  const range = maxYear - minYear;
  
  // Determine interval based on scale and range
  let interval = 1;
  if (range > 10) interval = 5;
  if (range > 100) interval = 50;
  if (range > 1000) interval = 500;

  for (let y = Math.floor(minYear / interval) * interval; y <= maxYear; y += interval) {
    ticks.push({
      year: y,
      pos: (y - minYear) * scale,
      isMajor: y % (interval * 5) === 0
    });
  }

  return ticks;
}

/**
 * Calculates geometric regions for Eras.
 */
export function getEraRegions(eras: any[], minYear: number, scale: number): EraRegion[] {
  return eras.map(era => ({
    id: era.id,
    name: era.name,
    startPos: (era.start_year - minYear) * scale,
    endPos: ((era.end_year ?? era.start_year + 100) - minYear) * scale,
    color: era.color
  }));
}
