import { Switch, signal, signalComponent, FC, Case } from 'sig';



const Box: FC = function Box(props, children) {
  return <div style={{ background: "white", height: "200px"}}>
    { children }
  </div>
}

const Card: FC = function Card(props, children) {
  return <div style={{ background: "blue", color: "white", height: "150", width: "150px"}}>
    { children }
  </div>
}


const Button: FC<{text: string, onClick: () => void }> = function Button({ text, onClick }) {
  return <button onClick={onClick}>
    { text }
  </button>
}


const boxId = signal(0)

const SwitchExamplePage = (function SwitchExamplePage() {
  return (
    <div>
      <Button text={"Click here"} onClick={() => boxId.setValue((curId) => (curId+1)%3)}/>

      <Switch track={[boxId]}>
        <Case when={([i]) => i === 0 }>
          <Box>Box number 0</Box>
        </Case>
        <Case when={([i]) => i === 1 }>
          <Box> 
            <Card> Box number 1 </Card> 
            <Card> Something 1 </Card>
          </Box>
        </Case>
        <Case when={([i]) => i === 2 }>
          <Box>Box number 2</Box>
        </Case>
      </Switch>
    </div>
  );
});


export default signalComponent(SwitchExamplePage);

