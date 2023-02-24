// @ts-nocheck

import { WC, createElement, createFragment } from "shared/jsx";
import { BaseWebComponent, Presentable, render } from "shared/core";
import { DefineComponent } from "shared/decorators";
import { OnConnected } from "shared/utils";


@DefineComponent('box-03')
class Box03 extends Presentable {
    public attr: any;
    buildStyle(props?: unknown): string {
        return ``;
    }
    buildTemplate(props?: unknown) {
        return (
            <div style={{ border: '2px solid red', margin: '8px', width: '40px' }}>
                <span>hello from Box 03</span>
            </div>
        );
    }

    preRender() {
        console.log('preRender Box03' )
    }
}


@DefineComponent('box-02')
class Box02 extends Presentable {
    public attr: any;
    buildStyle(props?: unknown): string {
        return ``;
    }
    buildTemplate(props?: unknown) {
        return (
            <div style={{ border: '1px solid red', margin: '8px' }}>
                <span>hello from Box 02</span>
            </div>
        );
    }

    preRender() {
        console.log('preRender Box02' )
    }
}

interface Box01Props {
    myName: string
}
@DefineComponent('box-01')
class Box01 extends Presentable<Box01Props> implements OnConnected {
    connectedCallback(): void {
        this.setState(({ border: 'black' }));
    }

    buildStyle(_props: Box01Props): string {
        return `
            .my-button {
                color: red;
            }
        `;
    }

    buildTemplate(props: Box01Props) {
        return (
            <div style={{
                border: `1px solid ${this.state.border}`,
                margin: '8px'
            }}>
                <Box03 />
                <button className="my-button"
                    onClick={() => {
                        this.setState(cur => ({ border: cur.border === 'black' ? 'green' : 'black' }))
                    }}>
                    click
                </button>
                <button
                    onClick={() => {
                        console.log(this.state);
                    }}>
                    see state
                </button>
                <span>{props.myName} hello from Box 01</span>
            </div>
        );
    }
    preRender() {
        console.log('preRender Box01' )
    }

    
}

@DefineComponent('my-wrapper')
class Wrapper extends Presentable {
    public attr: any;
    buildStyle(props?: unknown): string {
        return '';
    }
    buildTemplate(props?: unknown) {
        return (<div>
            <Box01 myName={'ofir'} />
            <Box02 />
            <div style={{ border: '1px solid black', margin: '8px' }}>
                <span> hello from Wrapper </span>
            </div>
        </div>);
    }

    preRender() {
        console.log('preRender Wrapper' )
    }
}
@DefineComponent('my-app')
export class App extends Presentable {
    buildStyle() {
        return '';
    }
    buildTemplate() {
        return <div>
            <Wrapper />
        </div>;
    }
    preRender() {
        console.log('preRender App' )
    }

}

window.onload = () => {
    render(<App />, 'root');
}

export { }