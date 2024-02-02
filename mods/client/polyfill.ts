Promise.withResolvers = function <T>() {
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
