
import { WC, createElement, createFragment } from "shared/jsx";
import { BaseWebComponent, Presentable } from "shared/core";
import { DefineComponent } from "shared/decorators";
import { OnConnected } from "shared/utils";


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
}

interface Box01Props {
    myName: string
}
@DefineComponent('box-01')
class Box01 extends Presentable<Box01Props>  implements OnConnected{
    connectedCallback(): void {
        this.setState(({ border: 'black' }));
    }

    buildStyle(_props: Box01Props): string {
        return ``;
    }

    buildTemplate(props: Box01Props) {
        return (
        <div style={{ 
            border: `1px solid ${this.state.border}`, 
            margin: '8px' 
        }}>
            <button 
                onClick={() => { 
                    this.setState(cur =>({ border: cur.border === 'black' ? 'green' : 'black' }));
                    this.setState(cur =>({ border1: '1' }));
                    this.setState(cur =>({ border2: '2' }));
                    this.setState(cur =>({ border3: '3' }));
                    this.setState(cur =>({ border4: '4' }));
                } }>
                click
            </button>
            <button 
                onClick={() => { 
                    console.log(this.state);
                } }>
                see state
            </button>
            <span>{props.myName} hello from Box 01</span>
        </div>);
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
            {/* @ts-ignore */}
            <Box01 myName={'ofir'} />
            {/* @ts-ignore */}
            <Box02 />

            <div style={{ border: '1px solid black', margin: '8px' }}>
                <span> hello from Wrapper </span>
            </div>
        </div>);
    }
}

export class App extends BaseWebComponent {
    buildStyle() {
        return '';
    }
    buildTemplate() {
        return <div>
            {/* @ts-ignore */}
            <Wrapper />    
        </div>;
    }

    constructor() {
        super();
    }

}

customElements.define(
    'my-appsss',
    App 
);

export { }