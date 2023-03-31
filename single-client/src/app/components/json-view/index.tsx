import { WC, Presentable, DefineComponent } from "../../../lib";

interface Props {
    content: string;
}

@DefineComponent("json-view", { noWrap: true })
export class JsonView extends Presentable<Props> {
  buildTemplate({ content }: Props) {
    return <div style={{ minHeight: '100px' }}>
        <pre>{content}</pre>
    </div>
  }
}
