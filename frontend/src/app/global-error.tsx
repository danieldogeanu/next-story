'use client'

import { useEffect } from "react";

export interface GlobalErrorFallbackProps {
  error: Error & { digest?: string };
  reset?: () => void;
}

/**
 * GlobalErrorFallback is only enabled in production. In development, the default
 * catch-all error overlay from Next.js will be used.
 */
export default function GlobalErrorFallback({error, reset}: GlobalErrorFallbackProps) {
  useEffect(() => {
    console.error(error); // TODO: Log the error to an error reporting service.
  }, [error]);

  // TODO: Style GlobalErrorFallback component to integrate with the site look.
  
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        {reset && <button onClick={() => reset()}>Try Again</button>}
      </body>
    </html>
  )
}
