
// We need to export this empty object to make the file a module,
// to prevent unintentional global namespace pollution.
export {};

// Extend the NodeJS global object.
declare global {
  var currentURL: CurrentURLSingleton | undefined;
}
