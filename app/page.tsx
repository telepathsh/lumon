'use client';

import { useState, useRef, useEffect } from 'react';
import FloatingNumber from '@/src/components/FloatingNumber';
import CRTEffect from '@/src/components/CRTEffect';

export default function Home() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentlyDraggedIndices, setCurrentlyDraggedIndices] = useState<number[]>([]);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [newlyReplacedIndices, setNewlyReplacedIndices] = useState<number[]>([]);
  const [gridDimensions, setGridDimensions] = useState({ cols: 0, rows: 0, total: 0 });
  const [numberValues, setNumberValues] = useState<number[]>([]);
  const draggedOverRef = useRef<number[]>([]);
  const draggedIndicesRef = useRef<number[]>([]);
  
  useEffect(() => {
    const calculateGrid = () => {
      const cellSize = 60; // Size of each floating number cell
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight * 0.6; // 60vh (100vh - 20vh top - 20vh bottom)
      
      const cols = Math.floor(containerWidth / cellSize);
      const rows = Math.floor(containerHeight / cellSize);
      const total = cols * rows;
      
      setGridDimensions({ cols, rows, total });
      setNumberValues(Array.from({ length: total }, () => Math.floor(Math.random() * 10)));
    };
    
    calculateGrid();
    window.addEventListener('resize', calculateGrid);
    return () => window.removeEventListener('resize', calculateGrid);
  }, []);
  
  useEffect(() => {
    console.log('Selected numbers:', selectedNumbers);
  }, [selectedNumbers]);
  
  const getAdjacentIndices = (index: number) => {
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
  
  const handleMouseDown = (index: number) => {
    setIsDragging(true);
    draggedOverRef.current = [numberValues[index]];
    draggedIndicesRef.current = [index];
    setCurrentlyDraggedIndices([index]);
  };
  
  const handleMouseEnter = (index: number) => {
    // Always update hovered index to the current number being hovered
    setHoveredIndex(index);
    if (isDragging) {
      // Only add if it's not the last number (to avoid duplicates from re-entering same cell)
      const lastValueIndex = draggedOverRef.current.length - 1;
      if (lastValueIndex < 0 || draggedOverRef.current[lastValueIndex] !== numberValues[index]) {
        draggedOverRef.current.push(numberValues[index]);
        draggedIndicesRef.current.push(index);
        setCurrentlyDraggedIndices([...draggedIndicesRef.current]);
      }
    }
  };
  
  const generateError = (selectedNumbers: number[]) => {
    // Stub for generateError function
    console.log('generateError called with:', selectedNumbers);
    // TODO: Implement error generation logic
  };

  const handleMouseUp = () => {
    if (isDragging && draggedOverRef.current.length > 0) {
      setIsDragging(false);
      
      // Call generateError with selected numbers
      generateError([...draggedOverRef.current]);
      
      // Set selected numbers for display
      setSelectedNumbers([...draggedOverRef.current]);
      
      // Immediately generate new numbers for the dragged positions
      const newNumberValues = [...numberValues];
      const replacedIndices = [...draggedIndicesRef.current];
      draggedIndicesRef.current.forEach(index => {
        newNumberValues[index] = Math.floor(Math.random() * 10);
      });
      setNumberValues(newNumberValues);
      setNewlyReplacedIndices(replacedIndices);
      
      // Clear newly replaced indices after fade-in animation
      setTimeout(() => {
        setNewlyReplacedIndices([]);
      }, 500);
      
      // Reset states
      setCurrentlyDraggedIndices([]);
      draggedOverRef.current = [];
      draggedIndicesRef.current = [];
    }
  };
  
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging && draggedOverRef.current.length > 0) {
        setIsDragging(false);
        
        // Call generateError with selected numbers
        generateError([...draggedOverRef.current]);
        
        // Set selected numbers for display
        setSelectedNumbers([...draggedOverRef.current]);
        
        // Immediately generate new numbers for the dragged positions
        const newNumberValues = [...numberValues];
        const replacedIndices = [...draggedIndicesRef.current];
        draggedIndicesRef.current.forEach(index => {
          newNumberValues[index] = Math.floor(Math.random() * 10);
        });
        setNumberValues(newNumberValues);
        setNewlyReplacedIndices(replacedIndices);
        
        // Clear newly replaced indices after fade-in animation
        setTimeout(() => {
          setNewlyReplacedIndices([]);
        }, 500);
        
        // Reset states
        setCurrentlyDraggedIndices([]);
        draggedOverRef.current = [];
        draggedIndicesRef.current = [];
      }
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging, numberValues]);

  return (
    <CRTEffect>
      <main style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        paddingTop: '20vh',
        paddingBottom: '20vh',
        gap: '2rem',
        boxSizing: 'border-box'
      }}>
        <div 
          onMouseLeave={() => {
            setHoveredIndex(null);
            if (!isDragging) {
              draggedOverRef.current = [];
              setSelectedNumbers([]);
              setCurrentlyDraggedIndices([]);
            }
          }}
          style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${gridDimensions.cols}, 1fr)`,
          gridTemplateRows: `repeat(${gridDimensions.rows}, 1fr)`,
          gap: '2px',
          width: '100vw',
          height: '60vh',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          padding: '10px',
          boxSizing: 'border-box'
        }}>
          {Array.from({ length: gridDimensions.total }, (_, i) => {
            const isHovered = hoveredIndex === i;
            const isAdjacent = hoveredIndex !== null && getAdjacentIndices(hoveredIndex).includes(i);
            const isDraggedNumber = currentlyDraggedIndices.includes(i);
            const isNewlyReplaced = newlyReplacedIndices.includes(i);
            
            return (
              <div
                key={i}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div
                  onMouseDown={() => handleMouseDown(i)}
                  onMouseEnter={() => handleMouseEnter(i)}
                  onMouseUp={handleMouseUp}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 100,
                    cursor: 'pointer'
                  }}
                />
                <div
                  style={{
                    transform: isDraggedNumber ? 'scale(2.5)' : isHovered ? 'scale(3.0)' : isAdjacent ? 'scale(1.8)' : 'scale(1.44)',
                    transformOrigin: 'center',
                    transition: 'transform 0.6s ease',
                    zIndex: isDraggedNumber ? 15 : isHovered ? 10 : isAdjacent ? 5 : 1,
                    willChange: 'transform',
                    pointerEvents: 'none',
                    opacity: isDraggedNumber ? 0.8 : 1,
                    animation: isNewlyReplaced ? 'fadeIn 0.5s ease-in' : undefined
                  }}
                >
                  <FloatingNumber value={numberValues[i]} />
                </div>
              </div>
            );
          })}
        </div>
        {selectedNumbers.length > 0 && (
          <div style={{
            width: '400px',
            height: '100px',
            border: '2px solid #00ff00',
            padding: '20px',
            marginTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            position: 'relative'
          }}>
            {selectedNumbers.map((number, index) => (
              <div
                key={index}
                style={{
                  color: '#00ff00',
                  fontSize: '2rem',
                  fontFamily: 'monospace',
                  fontWeight: '600',
                  animation: `fadeIn 0.3s ease ${index * 0.1}s both`
                }}
              >
                {number}
              </div>
            ))}
          </div>
        )}
      </main>
    </CRTEffect>
  );
}