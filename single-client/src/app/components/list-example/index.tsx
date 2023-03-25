import { WC, Presentable, DefineComponent, OnConnected } from "../../../lib";

interface Props {
  text: string;
  onChange: () => void | Promise<void>;
}

@DefineComponent("list-example", { noWrap: true })
export class ListExample extends Presentable<Props, { arr: any[] }> {
  
  state = { arr: [] };

  inc = () => this.setState(({ arr }) => ({ arr: [...arr, 1] }));
  dec = () =>
    this.setState(({ arr }) => {
        const a = [...arr];
      a.pop();
      return { arr: [...a] };
    });

  buildTemplate() {
    return (
      <div>
        <div style={{ display: "flex" }}>
          <button onClick={this.inc}>+</button>
          <button onClick={this.dec}>-</button>
        </div>
        <ul>{
            this.state.arr.map( (v, i) => (<li>{i}</li>) )}</ul>
      </div>
    );
  }
}
