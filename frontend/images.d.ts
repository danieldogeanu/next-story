// Declare image modules so that we can import images in .ts|.tsx our files.

interface NextImageImport {
  src: string;
  height: number;
  width: number;
  blurDataURL: string;
  blurWidth: number;
  blurHeight: number;
}

declare module '*.jpg' {
  const content: NextImageImport;
  export default content;
}

declare module '*.jpeg' {
  const content: NextImageImport;
  export default content;
}

declare module '*.png' {
  const content: NextImageImport;
  export default content;
}

declare module '*.gif' {
  const content: NextImageImport;
  export default content;
}

declare module '*.bmp' {
  const content: NextImageImport;
  export default content;
}

declare module '*.webp' {
  const content: NextImageImport;
  export default content;
}

declare module '*.avif' {
  const content: NextImageImport;
  export default content;
}
