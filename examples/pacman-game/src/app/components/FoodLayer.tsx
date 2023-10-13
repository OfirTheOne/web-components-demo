import { signal } from "@sigjs/signal";
import { FC, For } from "@sigjs/sig";
import colors from "../styles/Colors";
import { useGameStore } from "../store/game.store";
import { GAME_STATUS } from "../types/gameStatus";
import { Position } from "../types/position";

const eatPrecision = 18;


type FoodLayerProps = {
  border: number,
  foodSize: number,
  topScoreBoard: number,
  pacmanSize: number,
}

const FoodLayer: FC<FoodLayerProps> = ({ border, foodSize, topScoreBoard, pacmanSize }) => {
  const { setPoints, setGameStatus } = useGameStore.getState();
  const $pacmanPosition = useGameStore.select((store) => store.pacmanPosition);
  const $points = useGameStore.select((store) => store.points);
  const $foodAmount = useGameStore.select(state => state.foodAmount);
  const $foodMatrix = signal((() => {
    const amountOfFood = $foodAmount.value
    let currentTop = 0;
    let currentLeft = 0;
    const foods: Position[] = [];

    for (let i = 0; i <= amountOfFood; i++) {
      if (currentLeft + foodSize >= window.innerWidth - border) {
        currentTop += foodSize;
        currentLeft = 0;
      }
      if (
        currentTop + foodSize >=
        window.innerHeight - border - topScoreBoard
      ) {
        break;
      }
      const position = { left: currentLeft, top: currentTop };
      currentLeft = currentLeft + foodSize;
      foods.push(position);
    }
    return foods;
  })());

  $pacmanPosition.subscribe((currentPos) => {
    const uneatedFood =  $foodMatrix.value.filter((foodPosition) => {
      return !(
        currentPos.left + (pacmanSize - eatPrecision) / 2 >= foodPosition.left &&
        currentPos.left - (pacmanSize - eatPrecision) / 2 < foodPosition.left &&
        currentPos.top + (pacmanSize - eatPrecision) / 2 >= foodPosition.top &&
        currentPos.top - (pacmanSize - eatPrecision) / 2 < foodPosition.top
      ); 
    });
    if(uneatedFood.length !== $foodMatrix.value.length) {
      $foodMatrix.setValue(uneatedFood);
      // if (uneatedFood.length === $points.value + 1) {
      if (uneatedFood.length === 0) {
        setGameStatus(GAME_STATUS.WON);
      }
      setPoints($points.value + 1);
    }
  });

  return <For each={$foodMatrix} index={(pos) => `${pos.top}${pos.left}`}>
    {(position: Position) =>
    <div style={{
      position: 'absolute',
      top: `${position.top}px`,
      left: `${position.left}px`,
      width: '60px',
      height: '60px',
      display: 'block'
    }}>
      <div style={{
        borderRadius: '50px',
        width: '10px',
        height: '10px',
        backgroundColor: colors.color2,
        margin: '20px'
      }}></div>
    </div>
  }
  </For>
}


export default FoodLayer