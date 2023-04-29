
export const reduceTransform = <V>(value: unknown, transforms: ((value: unknown) => unknown)[]) => {
    return transforms.reduce((acc, transformer) => transformer(acc), value) as V;
}