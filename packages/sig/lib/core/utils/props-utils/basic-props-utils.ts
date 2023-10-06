
import { isSignal, Trackable } from '@sigjs/signal';

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
}




