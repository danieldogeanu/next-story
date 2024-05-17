'use client'
 
import { useEffect } from 'react';
 
export interface ErrorFallbackProps {
  error: Error & { digest?: string }
  reset?: () => void
}

export default function ErrorFallback({error, reset}: ErrorFallbackProps) {
  useEffect(() => {
    console.error(error); // TODO: Log the error to an error reporting service.
  }, [error]);

  // TODO: Style this component to integrate with the site look.
 
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset && reset()}>Try Again</button>
    </div>
  );
}
