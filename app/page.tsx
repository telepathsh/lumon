'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import FloatingNumber from './components/FloatingNumber';
import CRTEffect from './components/CRTEffect';

export default function Home() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentlyDraggedIndices, setCurrentlyDraggedIndices] = useState<number[]>([]);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [newlyReplacedIndices, setNewlyReplacedIndices] = useState<number[]>([]);
  const [gridDimensions, setGridDimensions] = useState({ cols: 0, rows: 0, total: 0 });
  const [numberValues, setNumberValues] = useState<number[]>([]);
  const [maxProgress, setMaxProgress] = useState(0);
  const [totalNumbersSelected, setTotalNumbersSelected] = useState(0);
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
  
  useEffect(() => {
    // Progress based on total numbers selected (assuming 50 numbers for 100%)
    const newProgress = Math.min((totalNumbersSelected / 50) * 100, 100);
    console.log('Total numbers selected:', totalNumbersSelected, 'New progress:', newProgress);
    setMaxProgress(newProgress);
  }, [totalNumbersSelected]);
  
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
      
      // Capture the count before clearing refs
      const selectedCount = draggedOverRef.current.length;
      const selectedNumbersCopy = [...draggedOverRef.current];
      const replacedIndices = [...draggedIndicesRef.current];
      
      // Call generateError with selected numbers
      generateError(selectedNumbersCopy);
      
      // Set selected numbers for display
      setSelectedNumbers(selectedNumbersCopy);
      
      // Add selected numbers count to total for progress bar
      console.log('Adding to total:', selectedCount, 'numbers');
      setTotalNumbersSelected(prev => {
        const newTotal = prev + selectedCount;
        console.log('Updating totalNumbersSelected from', prev, 'to', newTotal);
        return newTotal;
      });
      
      // Immediately generate new numbers for the dragged positions
      const newNumberValues = [...numberValues];
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
        
        // Capture the count before clearing refs
        const selectedCount = draggedOverRef.current.length;
        const selectedNumbersCopy = [...draggedOverRef.current];
        const replacedIndices = [...draggedIndicesRef.current];
        
        // Call generateError with selected numbers
        generateError(selectedNumbersCopy);
        
        // Set selected numbers for display
        setSelectedNumbers(selectedNumbersCopy);
        
        // Add selected numbers count to total for progress bar
        console.log('Global handler adding to total:', selectedCount, 'numbers');
        setTotalNumbersSelected(prev => {
          const newTotal = prev + selectedCount;
          console.log('Global handler updating totalNumbersSelected from', prev, 'to', newTotal);
          return newTotal;
        });
        
        // Immediately generate new numbers for the dragged positions
        const newNumberValues = [...numberValues];
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
      <main className="flex flex-col items-center justify-start mt-8 min-h-screen gap-8 box-border">
        
        <div className="w-[95vw] flex flex-row justify-center items-center gap-4">
          <div className="progress-bar border text-[#00b5cc] h-12 px-8 py-2 w-full font-bold text-2xl flex items-center justify-between relative overflow-hidden">
            <div 
              className="absolute top-0 right-0 h-full bg-[#00b5cc] transition-all duration-300 ease-out"
              style={{ 
                width: `${maxProgress}%`,
                opacity: 0.2
              }}
            ></div>
            <span className="relative z-10">Cold Harbor</span>
            <span className="relative z-10">
              {Math.round(maxProgress)}%
            </span>
          </div>
          <Image src="lumon_logo.svg" alt="Lumon Logo from Severence" width={200} height={140} className="mx-6" />
        </div>
        
        <div className="w-screen py-4 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-[#00b5cc] z-20"></div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-[#00b5cc] z-20"></div>
          <div 
            className="select-none p-4 box-border h-full overflow-hidden gap-[2px] w-full"
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
            gridTemplateRows: `repeat(${gridDimensions.rows}, 1fr)`
          }}>
            {Array.from({ length: gridDimensions.total }, (_, i) => {
            const isHovered = hoveredIndex === i;
            const isAdjacent = hoveredIndex !== null && getAdjacentIndices(hoveredIndex).includes(i);
            const isDraggedNumber = currentlyDraggedIndices.includes(i);
            const isNewlyReplaced = newlyReplacedIndices.includes(i);
            
            return (
              <div
                key={i}
                className="relative w-full h-full flex items-center justify-center"
              >
                <div
                  onMouseDown={() => handleMouseDown(i)}
                  onMouseEnter={() => handleMouseEnter(i)}
                  onMouseUp={handleMouseUp}
                  className="absolute inset-0 z-[100] cursor-pointer"
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
        </div>
        {selectedNumbers.length > 0 && (
          <div className="w-[400px] h-[100px] border-2 border-[#00b5cc] p-5 mt-8 flex flex-wrap gap-[15px] items-center justify-center bg-transparent relative">
            {selectedNumbers.map((number, index) => (
              <div
                key={index}
                className="text-[#00b5cc] text-[2rem] font-mono font-semibold"
                style={{
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