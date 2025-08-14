import { NextRequest, NextResponse } from 'next/server';

// Server-side error functions (copied from app/errors.ts)
function typeError(): string {
  const user = { name: 'John', age: 30 };
  // @ts-ignore
  return user.email; // Property 'email' does not exist on type
}

function nullReferenceError(): string {
  const data: string | null = Math.random() > 0.5 ? 'hello' : null;
  // @ts-ignore
  return data ? data.toUpperCase() : ''; // Handle null case
}

function indexError(): number {
  const numbers = [1, 2, 3];
  const index = Math.floor(Math.random() * 10);
  // @ts-ignore
  return numbers[index] !== undefined ? numbers[index].toString() : 'Index out of bounds'; // Handle undefined case
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { selectedNumbers } = body;
    
    const randomNum = Math.floor(Math.random() * 4) + 1;
    
    console.log('Generate error endpoint called with:', { selectedNumbers, randomNum });

    if (randomNum === 5) {
      // Success case
      return NextResponse.json({ 
        success: true, 
        message: 'MDR-OK: Your contribution has been noted. Your work is satisfactory.'
      });
    } else {
      // Error case - this will cause server-side errors that get logged in Vercel
      let errorResult;
      switch (randomNum) {
        case 1:
          errorResult = typeError();
          break;
        case 2:
          errorResult = nullReferenceError();
          break;
        case 3:
          errorResult = indexError();
          break;
      }
      
      return NextResponse.json({ 
        success: false, 
        message: 'MDR-ERR: The data remains unrefined.',
        errorType: randomNum,
        result: errorResult
      });
    }
  } catch (error) {
    // This error will be logged in Vercel
    console.error('Server error in generate-error endpoint:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'MDR-ERR: The data remains unrefined.',
        serverError: true
      },
      { status: 500 }
    );
  }
}