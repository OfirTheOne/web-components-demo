

import { WC, Presentable, DefineComponent } from "../../../lib";

interface Props {
  text: string;
  onChange: () => void | Promise<void>;
}

@DefineComponent("my-input", { noWrap: true })
export class Input extends Presentable<Props> {
  buildTemplate({ onChange }: Props) {
    return <input className='Input' onChange={onChange}/>;
  }
}
