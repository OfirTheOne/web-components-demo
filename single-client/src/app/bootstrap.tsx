
import { WC, createElement, createFragment } from "../lib/jsx";
import { render } from "../lib/core";

import { App } from "./app"

window.onload = () => {
    render(<App />, 'root');
}

