

export const memoisedFunction = <T extends ((...args: any[]) => any)>(fn: T) => {
    let lastArgs: Parameters<T>; 
    let lastResult: ReturnType<T>;
    return ((...args: Parameters<T>): ReturnType<T> => {
      if(lastArgs === args) {
        return lastResult;
      }
      lastArgs = args;
      const result = fn(...args);
      lastResult = result;
      return result;
    })
  }