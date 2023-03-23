

import { WC, Presentable, DefineComponent, OnConnected } from "../lib";
import { Tab } from "./components";
import { ListExample } from "./components/list-example";
import { SearchBar } from "./components/search-bar";

@DefineComponent('my-counter-and-tab')
class CounterAndTab extends Presentable<any, { counter: number, searchResult?: string }> implements OnConnected {
    
    inc = () => {
        this.setState(({counter}) => ({ counter: counter+1 }));
    }

    onSearch = () => {
        this.setState((state) => ({ ...(state||{}), searchResult: 'searchResult' }));
    }

    connectedCallback(): void {
        this.setState(({ counter: 0 }));
    }

    buildTemplate(props: any) {
        return (
            <div>
                <ListExample></ListExample>
                <SearchBar onSearchClick={this.onSearch}></SearchBar>
                <div style={{
                    border: `1px solid red`,
                    margin: '8px'
                }}>
                    
                    <button className="my-button"
                        onClick={this.inc}>
                        Inc
                    </button>
                    
                    <span>Counter : {String(this.state.counter)} </span>
                </div>
                <Tab tabs={[
                    {
                        title: "Tab 1",
                        id: "0",
                        content: <p>{this.state.searchResult||''}</p>,
                    },
                    {
                        title: "Tab 2",
                        id: "1",
                        content: <p>Tab 2 works!</p>,
                    },
                    {
                        title: "Tab 3",
                        id: "2",
                        content: <p>Tab 3 works!</p>,
                    },
                ]} />

            </div>
        );
    }

    preRender() {
        console.log('preRender CounterAndTab')
    }
}


@DefineComponent('my-app')
export class App extends Presentable {

    buildTemplate() {
        return <div>
            <CounterAndTab></CounterAndTab>
        </div>;
    }
    preRender() {
        console.log('preRender App');
    }

}
