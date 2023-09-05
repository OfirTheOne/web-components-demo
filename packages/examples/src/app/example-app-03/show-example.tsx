import { Show, signal, signalComponent, onDispose, onMount, onUnmount, FC } from 'sig';

const BoxFallback: FC = function BoxFallback(props, children) {
    onUnmount(() => {
        console.log("Unmounting BoxFallback");
    });
    onMount(() => {
        console.log("Mount BoxFallback");
    });
    onDispose(() => {
        console.log("Disposing BoxFallback");
    });
    
    return <div style={{ background: "white", height: "200px" }}>
        {children}
    </div>
};


const BoxFront: FC = function BoxFront(props, children) {
    onUnmount(() => {
        console.log("Unmounting BoxFront");
    });

    onMount(() => {
        console.log("Mount BoxFront");
    });

    onDispose(() => {
        console.log("Disposing BoxFront");
    });
    return <div style={{ background: "blue", height: "200px" }}>
        {children}
    </div>
};

const Card: FC = function Card(props, children) {
    return <div style={{ background: "blue", color: "white", height: "150", width: "150px" }}>
        {children}
    </div>
};


const Button: FC<{ text: string, onClick: () => void }> = function Button({ text, onClick }) {
    return <button onClick={onClick}>
        {text}
    </button>
};


const ShowExamplePage = (function SwitchExamplePage() {
    const boxIdSignal = signal(0)
    return (
        <div>
            <Button text={"Click here"} onClick={() => boxIdSignal.setValue((curId) => (curId + 1) % 2)} />

            <Show
                track={boxIdSignal}
                fallback={<BoxFallback>Box fallback</BoxFallback>}
            >
                <BoxFront>
                    <Card> Box number : {boxIdSignal} </Card>
                    <Card> Another Something </Card>
                </BoxFront>
            </Show>
        </div>
    );
});



export default signalComponent(ShowExamplePage);
