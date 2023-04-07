
import { WC } from "../lib/jsx";
import { createRef, createSignal } from "../lib/core";
import { useEffect } from "../lib/core/hooks/use-effect";

function SearchBar()  {
    const [getText, setText] = createSignal('');

    useEffect(() => {
        console.log('SearchBar useEffect');
        if(getText().length > 3) {
            alert(getText());
        }
    }, [getText()]);

    return <div>
        <Input
            text={getText()}
            onKeyup={(e) => setText(e.target.value)}
        />
        <Button text="Search" onClick={() => alert(getText())} />
    </div>;
}

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
    const [getButton, setButton] = createRef<HTMLButtonElement>();
    console.log(getButton() instanceof HTMLButtonElement);
    
    return <button
        ref={setButton}
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


 