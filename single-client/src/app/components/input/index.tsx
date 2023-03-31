

import { WC, Presentable, DefineComponent } from "../../../lib";

interface Props {
  text: string;
  onKeyup: () => void | Promise<void>;
}

@DefineComponent("my-input", { noWrap: true })
export class Input extends Presentable<Props> {
  buildTemplate({ text, onKeyup }: Props) {
    return <input value={text} className='Input' onKeyup={onKeyup}/>;
  }
}
