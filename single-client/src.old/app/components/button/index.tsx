import { WC, Presentable, DefineComponent } from "../../../lib";

interface Props {
  text: string;
  onClick: () => void | Promise<void>;
}

@DefineComponent("my-button", { noWrap: true })
export class Button extends Presentable<Props> {
  buildTemplate({ text, onClick }: Props) {
    return <button className='Button' onClick={onClick}>{text}</button>;
  }
}
