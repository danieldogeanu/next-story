// Here we store the types available globally in our app.

/** Represents the allowed HTTP methods for making requests. */
export type HTTPMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';

/** Helper type to help resolve complex types, for easier debugging. */
export type Resolve<T> = { [K in keyof T]: T[K] };
