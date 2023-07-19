import { FC } from '@lib/index';
import { For, signal, signalComponent } from '@lib/core/signal-core';

const listItems = [
    { id: 1, text: "Item 1" },{ id: 2, text: "Item 2" },{ id: 3, text: "Item 3" },{ id: 4, text: "Item 4" },{ id: 5, text: "Item 5" },{ id: 6, text: "Item 6" },
];
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

const ForExamplePage = (function SwitchExamplePage() {
    const listSignal = signal(listItems);
    return (
        <>
            <Button text={"Shuffle"} onClick={() => listSignal.setValue((list) => shuffleList(list))} />
            <Box>
                <h2>With Index</h2>
                <For each={listSignal} index={'id'}>
                    {(item) => <Card>{item.text}</Card>}
                </For>
            </Box>
            <Box>
                <h2>Without Index</h2>
                <For each={listSignal}>
                    {(item) => <Card>{item.text}</Card>}
                </For>
            </Box>
        </>
    );
});

const shuffleList = (arr: any[]) => {
    const newArr = [...arr]
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr
}

export default signalComponent(ForExamplePage);