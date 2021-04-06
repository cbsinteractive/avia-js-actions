export function parallel(...args: any[]) {
  return Promise.all(args);
}
