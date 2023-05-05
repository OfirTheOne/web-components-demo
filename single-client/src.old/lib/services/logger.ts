import { Globals } from "../globals";


export const SysAction = {
    render: 'render',
    internalRender: 'internal-render',
    containerInit: 'container-init',
    componentInit: 'component-init',
    unmounted: 'unmounted',
}

export class Logger {

    static logAction(action: keyof typeof SysAction, message: string) {
        if(Globals.logLevel) {
            this.log(`WC [${this.getTs()}] | Action [${SysAction[action]}] -- ${message}`);
        }
    }
    static log(...args: any[]) {
        console.log(...args);

    }

    static getTs() {
        return new Date().toISOString();
    }
}


