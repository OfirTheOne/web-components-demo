

type ClassList = Array<string | string[] | Record<string, boolean>>;

const resolveClassList = (classList: ClassList): Record<string, boolean> => {
    const flattenClassList = classList.flat();
    return flattenClassList.reduce(
        (accClassList, item) => {
            if (typeof item === 'string') {
                return { 
                    ...accClassList, 
                    [item]: true,
                };
            } else {
                return { 
                    ...accClassList, 
                    ...Object.entries(item)
                        .reduce((acc, [key, value]) => ({ 
                            ...acc, 
                            [key]: value 
                        }), {} as Record<string, boolean>
                    )
                 };
            }
        }, 
        {} as object
    ) as Record<string, boolean>;       
}

export class BasicPropsUtils {
    static mutateBasicProps(props: Record<string, unknown>) {

        if(props['class:list']) {
            if(props['className']) {
                console.warn(`class:list and className are mutually exclusive. className will be ignored`);
                delete props['className'];
            }
            const resolvedClassList = resolveClassList(props['class:list'] as ClassList);
            props['class:list'] = resolvedClassList;
        } else if(props['className']) {
            props['class'] = props['className'];
            delete props['className'];
        }
        return props;
    }
}




