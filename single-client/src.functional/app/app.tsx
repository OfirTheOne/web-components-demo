
import { WC } from "../lib/jsx";
import { createSignal } from "../lib/core";

export function App() {
    return (<div>
        <h1>Single Client</h1> 
        <Button />   
    </div>);
}
        


function Button() {
    const [getClickCounter, setClickCounter] = createSignal(0);
    return <button
        onClick={() => setClickCounter(getClickCounter() + 1)}
    >Click</button>;
}