
import { For, derivedSignal, onMount, signal, FC, DerivedSignal } from "sig";

const Button: FC<Record<'onUp' | 'onDown' | 'onLeft' | 'onRight', JSX.MouseEventHandler<HTMLInputElement>>> = ({ onUp, onDown, onLeft, onRight }) => {
    return (
        <div className="buttons">
            <div className="upwards">
                <input className="up" onClick={onUp} type="button" value="UP" />
            </div>
            <div className="sideways">
                <input className="left" onClick={onLeft} type="button" value="LEFT" />
                <input
                    className="right"
                    onClick={onRight}
                    type="button"
                    value="RIGHT"
                />
            </div>
            <div className="downwards">
                <input className="down" onClick={onDown} type="button" value="DOWN" />
            </div>
        </div>
    );
};

const Food: FC<{ dot: DerivedSignal<[number, number]> }> = props => {
    const $dotStyle = derivedSignal(props.dot, dot => ({
        left: `${dot[0]}%`,
        top: `${dot[1]}%`
    }))
    return <div className="food" style={$dotStyle as any} />;
};

const Snake = props => {
    return (
        <div>
            <For each={props.snakeDots} index={(dot) =>`${dot[0]},${dot[1]}`}>
                {(dot, i) => {
                    const style = {
                        left: `${dot[0]}%`,
                        top: `${dot[1]}%`
                    };
                    return <div className="snake" style={style} />;
                }}</For>
        </div>
    );
};

const getRandomFood = (): [number, number] => {
    const min = 1;
    const max = 98;
    const x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    const y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    return [x, y];
};

const KEY_CODES_TO_DIRECTION = {
    37: "LEFT",
    38: "UP",
    39: "RIGHT",
    40: "DOWN"
};
const initialState = {
    food: getRandomFood(),
    direction: "RIGHT",
    speed: 100,
    snakeDots: [[50, 50], [50, 52]] as [number, number][]
};

function Game() {
    const $gameState = signal(initialState);
    const $snakeDots = derivedSignal($gameState, (state) => state.snakeDots);
    const $food = derivedSignal($gameState, (state) => state.food )
    let timer: NodeJS.Timer | null = null;
    onMount(() => {
        timer = setInterval(moveSnake, $gameState.value.speed);
        document.onkeydown = onKeyDown;
    });

    $gameState.subscribe(() => {
        onSnakeOutOfBounds();
        onSnakeCollapsed();
        onSnakeEats();
    });

    const onKeyDown = e => {
        if(e.keyCode && e.keyCode in KEY_CODES_TO_DIRECTION) {
            $gameState.setValue((prev => ({ ...prev, direction: KEY_CODES_TO_DIRECTION[e.keyCode] })));
        }
    };
    const moveSnake = () => {
        const dots = [...$gameState.value.snakeDots];
        let head = dots[dots.length - 1];
            switch ($gameState.value.direction) {
                case "RIGHT":
                    head = [head[0] + 2, head[1]];
                    break;
                case "LEFT":
                    head = [head[0] - 2, head[1]];
                    break;
                case "DOWN":
                    head = [head[0], head[1] + 2];
                    break;
                case "UP":
                    head = [head[0], head[1] - 2];
                    break;
            }
            dots.push(head);
            dots.shift();
            $gameState.setValue(prev => ({
                ...prev,
                snakeDots: dots
            }));
    };
    const onSnakeOutOfBounds = () => {
        const head = $gameState.value.snakeDots.at(-1);
        if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
            gameOver();
        }
    }
    const onSnakeCollapsed = () => {
        const snake = [...$gameState.value.snakeDots];
        const head = snake.at(-1);
        snake.pop();
        snake.forEach(dot => {
            if (head[0] == dot[0] && head[1] == dot[1]) {
                gameOver();
            }
        });
    }
    const onSnakeEats = () => {
        const head = $gameState.value.snakeDots.at(-1);
        const food = $gameState.value.food;
        if (head[0] == food[0] && head[1] == food[1]) {
            $gameState.setValue(prev => ({
                ...prev,
                food: getRandomFood()
            }));
            increaseSnake();
            increaseSpeed();
        }
    }
    const increaseSnake = () => {
        const newSnake = [...$gameState.value.snakeDots];
        newSnake.unshift([] as any);
        $gameState.setValue(prev => ({
            ...prev,
            snakeDots: newSnake
        }));
    }
    const increaseSpeed = () => {
        if ($gameState.value.speed > 10) {
            $gameState.setValue(prev => ({
                ...prev,
                speed: $gameState.value.speed - 20
            }));
        }
    }
    const gameOver = () => {
        alert(`GAME OVER, your score is ${$gameState.value.snakeDots.length - 2}`);
        $gameState.setValue(_prev => initialState);
    }
    const createDirectionHandler = (direction: string, nextFrameDot: (dot: [number, number]) => [number, number]) => {
        const dots = [...$gameState.value.snakeDots];
        let head = dots[dots.length - 1];
        head = nextFrameDot(head); 
        dots.push(head);
        dots.shift();
        $gameState.setValue(prev => ({
            ...prev,
            direction: direction,
            snakeDots: dots
        }));
    };

    const onDown = () => createDirectionHandler("DOWN", head => [head[0], head[1] + 2]);
    const onUp = () => createDirectionHandler("UP", head => [head[0], head[1] - 2]);
    const onRight = () => createDirectionHandler("RIGHT", head => [head[0] + 2, head[1]]);
    const onLeft = () => createDirectionHandler("LEFT", head => [head[0] - 2, head[1]]);

    return (
        <div>
            <div>
                <div className="game-area">
                    <Snake snakeDots={$snakeDots} />
                    <Food dot={$food} />
                </div>
                <Button
                    onDown={onDown}
                    onLeft={onLeft}
                    onRight={onRight}
                    onUp={onUp}
                />
            </div>
        </div> 
    );

}

export default Game;
