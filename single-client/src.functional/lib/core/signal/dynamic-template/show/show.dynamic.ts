import { FC } from "../../../../models/functional-component";
import { signalComponent } from "../../signal-component/signal-component";



interface ShowProps {
    when: boolean;
}

export const Show = signalComponent(
    function Show(props: ShowProps, children) {
    const { when } = props;
    if(when) {
        return children;
    }
    return null;
}) as FC<ShowProps>;