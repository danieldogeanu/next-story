// Here we store the types available globally in our app.

/** Represents the allowed HTTP methods for making requests. */
export type HTTPMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';


export interface PageParams {
  slug: string[];
}

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}
