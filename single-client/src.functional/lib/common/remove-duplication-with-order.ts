
export const removeDuplicationWithOrder = <T>(list: T[]): T[] => {
    const map = new Map<T, boolean>();
    const result: T[] = [];
    list.forEach(item => {
        if (!map.has(item)) {
            map.set(item, true);
            result.push(item);
        }
    });
    return result;

}

