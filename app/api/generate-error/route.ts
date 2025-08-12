import { NextRequest, NextResponse } from 'next/server';

// Server-side error functions (copied from app/errors.ts)
function typeError(): string {
  try {
    const user = { name: 'John', age: 30 };
    // @ts-ignore
    return user.email || ''; // Property 'email' does not exist on type, return empty string if undefined
  } catch (error) {
    return 'Type Error: Property does not exist';
  }
}

function nullReferenceError(): string {
  try {
    const data: string | null = Math.random() > 0.5 ? 'hello' : null;
    // @ts-ignore
    return data !== null ? data.toUpperCase() : 'NULL'; // Handle null case properly
  } catch (error) {
    return 'Null Reference Error: Cannot read properties of null';
  }
}

function indexError(): string {
  try {
    const numbers = [1, 2, 3];
    const index = Math.floor(Math.random() * 10);
    const value = numbers[index];
    // @ts-ignore
    return (value !== undefined && value !== null) ? String(value) : 'UNDEFINED_VALUE'; // Return '0' if undefined/null to prevent toString error
  } catch (error) {
    return 'Index Error: Cannot read properties of undefined';
  }
}

async function asyncError(): Promise<string> {
  // Simulate an actual async error
  return Promise.reject(new Error('Simulated async error'));
}

export async function POST(request: NextRequest) {
  try {
    let body = {};
    try {
      body = await request.json();
    } catch (jsonError) {
      console.warn('Invalid JSON in request body');
      body = {};
    }
    
    const { selectedNumbers } = body as { selectedNumbers?: number[] };
    
    const randomNum = Math.floor(Math.random() * 5) + 1;
    
    console.log('Generate error endpoint called with:', { selectedNumbers, randomNum });

      if (false) {      // Success case
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
        case 4:
          try {
            errorResult = await asyncError();
          } catch (e: any) {
            errorResult = `Async Error: ${e.message}`;
          }
          break;
        default:
          errorResult = 'Unknown error occurred';
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