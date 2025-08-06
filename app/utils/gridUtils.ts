export interface GridDimensions {
  cols: number;
  rows: number;
  total: number;
}

export const calculateGrid = (): GridDimensions => {
  const cellSize = 60;
  const containerWidth = window.innerWidth;
  const containerHeight = window.innerHeight * 0.6;
  
  const cols = Math.floor(containerWidth / cellSize);
  const rows = Math.floor(containerHeight / cellSize);
  const total = cols * rows;
  
  return { cols, rows, total };
};

export const getAdjacentIndices = (index: number, gridDimensions: GridDimensions): number[] => {
  const row = Math.floor(index / gridDimensions.cols);
  const col = index % gridDimensions.cols;
  const adjacent: number[] = [];
  
  // Top
  if (row > 0) adjacent.push(index - gridDimensions.cols);
  // Bottom
  if (row < gridDimensions.rows - 1) adjacent.push(index + gridDimensions.cols);
  // Left
  if (col > 0) adjacent.push(index - 1);
  // Right
  if (col < gridDimensions.cols - 1) adjacent.push(index + 1);
  // Top-left
  if (row > 0 && col > 0) adjacent.push(index - gridDimensions.cols - 1);
  // Top-right
  if (row > 0 && col < gridDimensions.cols - 1) adjacent.push(index - gridDimensions.cols + 1);
  // Bottom-left
  if (row < gridDimensions.rows - 1 && col > 0) adjacent.push(index + gridDimensions.cols - 1);
  // Bottom-right
  if (row < gridDimensions.rows - 1 && col < gridDimensions.cols - 1) adjacent.push(index + gridDimensions.cols + 1);
  
  return adjacent;
};

export const generateRandomNumbers = (length: number): number[] => {
  return Array.from({ length }, () => Math.floor(Math.random() * 10));
};

export const calculateProgress = (totalNumbersSelected: number): number => {
  return Math.min((totalNumbersSelected / 50) * 100, 100);
};