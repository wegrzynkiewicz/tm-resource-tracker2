export function indent(data: string, delimiter: string): string {
  return data
    .split("\n")
    .map((line) => `${delimiter}${line}`)
    .join("\n");
}

export function withResolvers<T>(): { 
  promise: Promise<T>; 
  resolve: (value: T | PromiseLike<T>) => void; 
  reject: (reason: any) => void; 
} {
  let resolve, reject;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject } as unknown as {
    promise: Promise<T>,
    resolve: (value: T | PromiseLike<T>) => void,
    reject: (reason: any) => void,
  };
};
