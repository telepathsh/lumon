"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import FloatingNumber from "./components/FloatingNumber";
import CRTEffect from "./components/CRTEffect";
import ArrowIcon from "./components/arrow";
import {
  typeError,
  nullReferenceError,
  indexError,
  asyncError,
} from "./errors";
import {
  calculateGrid,
  getAdjacentIndices,
  generateRandomNumbers,
  calculateProgress,
  GridDimensions,
} from "./utils/gridUtils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Home() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentlyDraggedIndices, setCurrentlyDraggedIndices] = useState<
    number[]
  >([]);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [newlyReplacedIndices, setNewlyReplacedIndices] = useState<number[]>(
    []
  );
  const [gridDimensions, setGridDimensions] = useState<GridDimensions>({
    cols: 0,
    rows: 0,
    total: 0,
  });
  const [numberValues, setNumberValues] = useState<number[]>([]);
  const [maxProgress, setMaxProgress] = useState(0);
  const [totalNumbersSelected, setTotalNumbersSelected] = useState(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [hasCompletedSelection, setHasCompletedSelection] = useState<boolean>(false);
  const draggedOverRef = useRef<number[]>([]);
  const draggedIndicesRef = useRef<number[]>([]);

  useEffect(() => {
    const handleResize = () => {
      const dimensions = calculateGrid();
      setGridDimensions(dimensions);
      setNumberValues(generateRandomNumbers(dimensions.total));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setMaxProgress(calculateProgress(totalNumbersSelected));
  }, [totalNumbersSelected]);

  const handleMouseDown = (index: number) => {
    setIsDragging(true);
    setIsSuccess(false); // Reset success state when starting new selection
    setSelectedNumbers([]); // Clear selected numbers to hide the message
    setHasCompletedSelection(false); // Reset selection completed state
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
      if (
        lastValueIndex < 0 ||
        draggedOverRef.current[lastValueIndex] !== numberValues[index]
      ) {
        draggedOverRef.current.push(numberValues[index]);
        draggedIndicesRef.current.push(index);
        setCurrentlyDraggedIndices([...draggedIndicesRef.current]);
      }
    }
  };

  const generateError = (selectedNumbers: number[]) => {
    const randomNum = Math.floor(Math.random() * 5) + 1;

    if (randomNum === 5) {
      setIsSuccess(true);
    } else {
      setIsSuccess(false);

      switch (randomNum) {
        case 1:
          typeError();
          break;
        case 2:
          nullReferenceError();
          break;
        case 3:
          indexError();
          break;
        case 4:
          asyncError();
          break;
      }
    }
  };

  const handleMouseUp = () => {
    if (isDragging && draggedOverRef.current.length > 0) {
      setIsDragging(false);

      // Capture the count before clearing refs
      const selectedCount = draggedOverRef.current.length;
      const selectedNumbersCopy = [...draggedOverRef.current];
      const replacedIndices = [...draggedIndicesRef.current];

      // Set selected numbers for display
      setSelectedNumbers(selectedNumbersCopy);

      // Add selected numbers count to total for progress bar
      setTotalNumbersSelected((prev) => prev + selectedCount);

      // Immediately generate new numbers for the dragged positions
      const newNumberValues = [...numberValues];
      draggedIndicesRef.current.forEach((index) => {
        newNumberValues[index] = Math.floor(Math.random() * 10);
      });
      setNumberValues(newNumberValues);
      setNewlyReplacedIndices(replacedIndices);

      // Clear newly replaced indices after fade-in animation
      setTimeout(() => {
        setNewlyReplacedIndices([]);
      }, 500);

      // Call generateError with selected numbers (after number reset to ensure it happens)
      try {
        generateError(selectedNumbersCopy);
      } catch (error) {
        // Error is expected for demonstration purposes
        console.log("Error occurred:", error);
      }

      // Mark that we've completed a selection
      setHasCompletedSelection(true);

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

        // Set selected numbers for display
        setSelectedNumbers(selectedNumbersCopy);

        // Add selected numbers count to total for progress bar
        setTotalNumbersSelected((prev) => prev + selectedCount);

        // Immediately generate new numbers for the dragged positions
        const newNumberValues = [...numberValues];
        draggedIndicesRef.current.forEach((index) => {
          newNumberValues[index] = Math.floor(Math.random() * 10);
        });
        setNumberValues(newNumberValues);
        setNewlyReplacedIndices(replacedIndices);

        // Clear newly replaced indices after fade-in animation
        setTimeout(() => {
          setNewlyReplacedIndices([]);
        }, 500);

        // Call generateError with selected numbers (after number reset to ensure it happens)
        try {
          generateError(selectedNumbersCopy);
        } catch (error) {
          // Error is expected for demonstration purposes
          console.error("Error occurred:", error);
        }

        // Mark that we've completed a selection
        setHasCompletedSelection(true);

        // Reset states
        setCurrentlyDraggedIndices([]);
        draggedOverRef.current = [];
        draggedIndicesRef.current = [];
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isDragging, numberValues]);

  return (
    <>
      <CRTEffect>
        <main className="flex flex-col items-center justify-start h-full gap-8 box-border">
          <div className="w-[95vw] flex flex-row justify-center items-center gap-4 mt-8">
            <div className="progress-bar border text-[#00b5cc] h-12 px-8 py-2 w-full font-bold text-2xl flex items-center justify-between relative overflow-hidden">
              <div
                className="absolute top-0 right-0 h-full bg-[#00b5cc] transition-all duration-300 ease-out"
                style={{
                  width: `${maxProgress}%`,
                  opacity: 0.2,
                }}
              ></div>
              <span className="relative z-10">Cold Harbor</span>
              <span className="relative z-10">{Math.round(maxProgress)}%</span>
            </div>
            <Image
              src="lumon_logo.svg"
              alt="Lumon Logo from Severence"
              width={200}
              height={140}
              className="mx-6"
            />
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
                display: "grid",
                gridTemplateColumns: `repeat(${gridDimensions.cols}, 1fr)`,
                gridTemplateRows: `repeat(${gridDimensions.rows}, 1fr)`,
              }}
            >
              {Array.from({ length: gridDimensions.total }, (_, i) => {
                const isHovered = hoveredIndex === i;
                const isAdjacent =
                  hoveredIndex !== null &&
                  getAdjacentIndices(hoveredIndex, gridDimensions).includes(i);
                const isDraggedNumber = currentlyDraggedIndices.includes(i);
                const isNewlyReplaced = newlyReplacedIndices.includes(i);

                const scale = isDraggedNumber
                  ? 2.2
                  : isHovered
                  ? 2.6
                  : isAdjacent
                  ? 2.0
                  : 1.4;

                return (
                  <div
                    key={i}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    <div
                      onMouseDown={() => handleMouseDown(i)}
                      onMouseEnter={() => handleMouseEnter(i)}
                      onMouseUp={handleMouseUp}
                      className="absolute inset-0 z-[100] cursor-pointer bg-transparent"
                      style={{ pointerEvents: 'all' }}
                    />
                    <div
                      style={{
                        zIndex: isDraggedNumber
                          ? 15
                          : isHovered
                          ? 10
                          : isAdjacent
                          ? 5
                          : 1,
                        pointerEvents: "none",
                        opacity: isDraggedNumber ? 0.8 : 1,
                        animation: isNewlyReplaced
                          ? "fadeIn 0.5s ease-in"
                          : undefined,
                      }}
                    >
                      <FloatingNumber value={numberValues[i]} scale={scale} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {hasCompletedSelection && isSuccess ? (
            <div className="text-[#00b5cc] flex flex-row items-center justify-center gap-4">
              <span className="font-bold text-2xl p-4 border-2 w-fit">
                MDR-OK
              </span>
              <span className="m-4 text-lg">
                <div>
                  Your contribution has been noted. Your work is satisfactory.
                </div>
                <div>
                  The board is watching, and may reward exceptional refiners with a waffle party for their hard work.
                </div>
              </span>
              <div className="text-6xl">🧇</div>
            </div>
          ) : hasCompletedSelection && !isSuccess ? (
            <>
              <div className="text-[#00b5cc] flex flex-row items-center justify-center gap-4">
                <span className="font-bold text-2xl p-4 border-2 border-red-800 w-fit">
                  MDR-ERR
                </span>
                <span className="m-4 text-lg">
                  <div>The data remains unrefined.</div>
                  <div>Remember, the data is always right.</div>
                </span>
                <div className="p-4 flex items-center gap-4">
                  <Image
                    src="/telepath_logo.svg"
                    alt="Telepath Logo"
                    width={180}
                    height={35}
                  />
                  <a
                    href="https://app.telepath.sh/demo"
                    className="group cursor-pointer bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg flex flex-row gap-3 items-center transition-colors duration-200"
                  >
                    Take Corrective Action
                    <ArrowIcon />
                  </a>
                </div>
              </div>
            </>
          ) : null}
          <div className="absolute right-4 bottom-14">
            <Popover>
              <PopoverTrigger>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-circle-question-mark-icon lucide-circle-question-mark"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
              </PopoverTrigger>
              <PopoverContent className="bg-[#071216] text-[#00b5cc] p-4 w-auto m-4">
                Congratulations, you're the newest employee at Lumon Industries!
                <br />
                Your task is to refine the data by selecting numbers in the
                grid.
                <br />
                <br />
                <strong>How to Play:</strong>
                <br />
                1. Click and drag to select numbers in the grid.
                <br />
                2. The goal is to refine the data by selecting the correct
                numbers.
                <br />
                3. If you select the right numbers, you'll see a success message.
                <br />
                4. If you select the wrong numbers, you'll see an error message.
                <br />
                <br />
                <strong>Tips:</strong>
                <br />
                - The data is always right, so trust the numbers.
                <br />
                - Mistakes are normal. To seek a correction, visit{" "}
                <a
                  href="https://lumon.telepath.sh"
                  className="text-fuchsia-400"
                >
                  TELEPATH
                </a>{" "}
                to right your path.
                <br />
                - Remember, our work is mysterious and important.
                <br />
                <br />
                <strong>Important:</strong>
                <br />
                This is a test of your ability to refine data.
                <br />
                Your performance will be monitored, and your work is crucial to the success of
                Lumon Industries.
                <br />
                Hail Keir!
              </PopoverContent>
            </Popover>
          </div>
          <div className="bg-[#00b5cc] w-full h-8 text-[#071216] justify-center flex items-center text-sm font-bold font-mono mt-auto">
            03F7H : 7F903
          </div>
        </main>
      </CRTEffect>
    </>
  );
}
