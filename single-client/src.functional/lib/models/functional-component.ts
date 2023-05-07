import { Props } from "./props";


export interface FunctionalComponent<P extends object = object> {
    (props: P, children: JSX.Element): JSX.Element;

}

export type FC<P extends object = object> = FunctionalComponent<P>;