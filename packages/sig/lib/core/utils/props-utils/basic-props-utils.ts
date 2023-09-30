
import { isSignal, Trackable } from '@sig/signal';

export class BasicPropsUtils {
    
    static resolveClassList(classList: Sig.ClassList) {
        const flattenClassList = classList.flat();
        const classDict = {
            classNameDict: {} as Record<string, boolean>,
            toggleClassList: {} as Record<string, Trackable<unknown>>,
            replaceClassList: [] as Trackable<unknown>[],
    
        }
        flattenClassList.forEach(
            (item) => {
                if (typeof item === 'string') {
                    classDict.classNameDict[item] = true;
                } else if (isSignal(item)) {
                    classDict.replaceClassList.push(item);
                } else {
                    Object.entries(item)
                        .forEach(([key, value]) => {
                            if (isSignal(value)) {
                                classDict.toggleClassList[key] = value;
                            } else {
                                classDict.classNameDict[key] = value;
                            }
                        });
                }
            });
        return classDict;
    }

    static mutateBasicProps(props: Record<string, unknown>) {
        if (props['class:list']) {
            if (props['className']) {
                console.warn(`class:list and className are mutually exclusive. className will be ignored`);
                delete props['className'];
            }
            const resolvedClassList = props['class:list'];
            props['class:list'] = resolvedClassList;
        } else if (props['className']) {
            props['class'] = props['className'];
            delete props['className'];
        }
        return props;
    }
}




