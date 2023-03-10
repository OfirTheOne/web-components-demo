

import { WC, createElement, createFragment } from "../lib/jsx";
import { Presentable } from "../lib/core";
import { DefineComponent } from "../lib/decorators";
import { OnConnected } from "../lib/models/hooks";
import { Tab } from "./tab";



@DefineComponent('my-counter-and-tab')
class CounterAndTab extends Presentable<any, { counter: number }> implements OnConnected {
    
    inc = () => {
        this.setState(({counter}) => ({ counter: counter+1 }));
    }

    connectedCallback(): void {
        this.setState(({ counter: 0 }));
    }

    buildStyle(_props: any): string {
        return ``;
    }

    buildTemplate(props: any) {
        return (
            <div>
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
                        id: "tab1",
                        content: <p>Tab 1 works!</p>,
                    },
                    {
                        title: "Tab 2",
                        id: "tab2",
                        content: <p>Tab 2 works!</p>,
                    },
                    {
                        title: "Tab 3",
                        id: "tab3",
                        content: <p>Tab 3 works!</p>,
                    },
                ]} />

            </div>
        );
    }

    preRender() {
        console.log('preRender Box01')
    }
}


@DefineComponent('my-app')
export class App extends Presentable {

    buildStyle() {
        return '';
    }
    buildTemplate() {
        return <div>
            <CounterAndTab></CounterAndTab>
        </div>;
    }
    preRender() {
        console.log('preRender App');
    }

}
