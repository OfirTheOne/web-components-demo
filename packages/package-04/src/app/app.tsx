
import { WC, createElement, createFragment } from "shared/jsx";
import { BaseWebComponent, Presentable } from "shared/core";
import { DefineComponent } from "shared/decorators";


@DefineComponent('box-02')
class Box02 extends Presentable {
    public attr: any;
    buildStyle(props?: unknown): string {
        return '';
    }
    buildTemplate(props?: unknown) {
        return (
        <div style={{ border: '1px solid red', margin: '8px' }}>
            <span>hello from Box 02</span>
        </div>);
    }

}

@DefineComponent('box-01')
class Box01 extends Presentable {
    public attr: any;
    buildStyle(props?: unknown): string {
        return '';
    }
    buildTemplate(props?: unknown) {
        return (
        <div style={{ border: '1px solid green', margin: '8px' }}>
            <span>hello from Box 01</span>
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
            <Box01 />
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