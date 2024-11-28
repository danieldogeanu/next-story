
// We need to export this empty object to make the file a module,
// to prevent unintentional global namespace pollution.
export {};

interface CurrentURLSingleton {
  setURL: (url: URL) => void;
  getURL: () => URL | null;
}

interface UmamiAnalytics {
  track: (eventName: string, eventData?: Record<string, any>) => void;
  identify: (userId: string) => void;
}

// Extend the NodeJS global object.
declare global {
  var currentURL: CurrentURLSingleton | undefined;
  var umami: UmamiAnalytics;

  interface Window {
    umami: UmamiAnalytics;
  }
}
