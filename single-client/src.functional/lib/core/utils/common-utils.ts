export function isAllLowerCase(str: string) {
  return str === str.toLowerCase();
}

export function isArrayShallowEqual<T = any>(a: T[], b: T[]): boolean {
  if (a === b) {
    return true;
  }
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
