import { FC } from 'sig';
import { For, signal, signalComponent } from 'sig';
import { onUnmount } from 'sig';

const listItems = () => [
    { id: 1, text: "Item 1" },{ id: 2, text: "Item 2" },{ id: 3, text: "Item 3" },
    { id: 4, text: "Item 4" },{ id: 5, text: "Item 5" },{ id: 6, text: "Item 6" },
    { id: 7, text: "Item 7" }
];
const Box: FC = function Box(props, children) {
    return <div style={{ background: "white", height: "200px" }}>
        {children}
    </div>
};
const Card: FC<{id?: string}> = function Card(props, children) {
    onUnmount(() => {
        console.log(`Unmount Card ${props.id}`)
    })
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
    const listSignal = signal(listItems().slice(0, 6));
    return (
        <>
            {/* <Button text={"Shuffle"} onClick={() => listSignal.setValue((list) => [ ...list, { id: list.length+1, text: 'asd'} ]) } /> */}
            <Button text={"Shuffle"} onClick={() => listSignal.setValue((list) => { list.pop(); return list;}) /* shuffleList(listItems()).slice(0, 7)) */ } />
            <Box>
                <h2>With Index</h2>
                <For each={listSignal} index={'id'}>
                    {(item, i) => <Card id={i}>{item.text}</Card>}
                </For>
            </Box>
            <Box>
                <h2>Without Index</h2>
                <For each={listSignal}>
                    {(item, i) => <Card id={i}>{item.text}</Card>}
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