import { Show, signal, signalComponent } from '@lib/core/signal-core';
import { FC } from '@lib/index';


const Box: FC = function Box(props, children) {
    return <div style={{ background: "white", height: "200px" }}>
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


export const ShowExamplePage = signalComponent(function SwitchExamplePage() {
    const boxIdSignal = signal(0)
    return (
        <div>
            <Button text={"Click here"} onClick={() => boxIdSignal.setValue((curId) => (curId + 1) % 2)} />

            <Show
                track={boxIdSignal}
                fallback={<Box>Box fallback</Box>}
            >
                <Box>
                    <Card> Box number : {boxIdSignal} </Card>
                    <Card> Another Something </Card>
                </Box>
            </Show>
        </div>
    );
});



