
import { WC } from "../lib/jsx";
import { createSignal } from "../lib/core";

export function App() {
    return (<div>
        <h1>Single Client</h1> 
        <SearchBar />   
    </div>);
}
        
interface ButtonProps {
    onClick: (e: any) => void;
    text: string;
}

function Button(props: ButtonProps) {
    return <button
        onClick={props.onClick}
    >{props.text}</button>;
}


interface InputProps {
    onKeyup: (e: any) => void;
    text: string;
}

function Input(props: InputProps) {
    console.log('Input text', props.text);
    return <input 
        value={props.text}
        onKeyup={props.onKeyup}
    />;
}



function SearchBar()  {
    const [getText, setText] = createSignal('');
    const text = getText();
    console.log('text', text);
    return <div>
        <Input
            text={text}
            onKeyup={(e) => setText(e.target.value)}
        />
        <Button text="Search" onClick={() => alert(getText())} />
    </div>;
}
