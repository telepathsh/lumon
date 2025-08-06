// Function with type error - accessing property that doesn't exist
export function typeError(): string {
  const user = { name: 'John', age: 30 };
  // @ts-ignore
  return user.email; // Property 'email' does not exist on type
}

// Function with null reference error
export function nullReferenceError(): string {
  const data: string | null = Math.random() > 0.5 ? 'hello' : null;
  // @ts-ignore
  return data.toUpperCase(); // Object is possibly 'null'
}

// Function with array index out of bounds
export function indexError(): number {
  const numbers = [1, 2, 3];
  const index = Math.floor(Math.random() * 10);
  // @ts-ignore
  return numbers[index].toString(); // Can return undefined, then calling toString() fails
}

// Function with async/await error - missing await
export function asyncError(): string {
  const fetchData = async () => 'async data';
  const result = fetchData(); // Missing await - returns Promise<string> not string
  // @ts-ignore
  return result.toUpperCase(); // Property 'toUpperCase' does not exist on type 'Promise<string>'
}

export function generateError(): any {
  return typeError();
}