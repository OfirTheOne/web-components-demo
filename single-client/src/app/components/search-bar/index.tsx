import { WC, Presentable, DefineComponent } from "../../../lib";

import { Button } from "../button";
import { Input } from "../input";

interface Props {
  onSearchClick: (text: string) => void | Promise<void>;
}

@DefineComponent("my-search-bar", { noWrap: true })
export class SearchBar extends Presentable<Props, { text: string }> {
  state = { text: "" };

  onInputChange = (e) => {
    this.setState({ text: e?.target?.value });
  };

  buildTemplate({ onSearchClick }: Props) {
    return (
      <div className="SearchBar">
        <div>
          <Input text={this.state.text} onChange={this.onInputChange} />
        </div>
        <div>
          <Button
            text={"Search"}
            onClick={() => onSearchClick(this.state.text)}
          />
        </div>
      </div>
    );
  }
}