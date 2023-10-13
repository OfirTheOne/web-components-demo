import { FC, ISignal, ISubscribableSignal, createSignal, derivedSignal, onDispose, onMount } from "@sigjs/sig";

import { Position, ghostStartPosition } from "../types/position";
import { DIRECTION, Direction } from "../types/direction";
import { Character } from "../types/character";
import { useGameStore } from "../store/game.store";
import { COLOR } from "../types/color";
import { GAME_STATUS } from "../types/gameStatus";


const GhostIcon: FC<{ color: ISignal<string>, }> = ({ color }) => (
  <svg
    fill={color as unknown as string}
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 129 129.7"
  >
    <g>
      <g>
        <path
          d="M128.1,129.7c-4.9-4.5-8.8-8.1-12.8-11.8c-3.4,3.7-6.7,7.3-10.3,11.3c-3.4-3.7-6.8-7.4-10.3-11.2
			c-3.5,3.8-6.7,7.3-10.3,11.2c-3.5-3.7-6.8-7.2-10.4-11.1c-3.3,3.6-6.5,6.9-10,10.7c-3.3-3.6-6.4-7-9.8-10.7
			c-3.5,3.7-6.8,7.3-10.6,11.4c-3.5-3.8-6.8-7.4-10.4-11.4c-3.5,3.7-6.8,7.3-10.6,11.4c-3.5-3.8-6.8-7.4-11.2-12.3
			c-3.4,4.3-6.7,8.4-10,12.5c-0.5-0.3-0.9-0.6-1.4-0.9c0-2.1,0-4.2,0-6.3c0.2-21.7-0.2-43.3,0.7-65C2.1,23.9,33.4-3.7,71.6,0.4
			c28.4,3,49.7,21.7,55.8,47.6c0.9,4,1.5,8.2,1.5,12.3c0.2,20.5,0.1,41,0.1,61.5C128.8,124,128.4,126.2,128.1,129.7z M39.1,67.2
			c6.4-0.1,11.3-5.3,11.2-11.7c-0.1-6.4-5.3-11.3-11.7-11.2c-6.4,0.1-11.3,5.2-11.2,11.6C27.6,62.4,32.7,67.3,39.1,67.2z
			 M100.3,55.8c0-6.4-5-11.4-11.4-11.4c-6.4,0-11.4,5-11.4,11.4s5,11.4,11.4,11.4C95.2,67.2,100.3,62.2,100.3,55.8z"
        />
      </g>
    </g>
  </svg>
);

const Ghost = (props: Character) => {
  const { setGameStatus } = useGameStore.getState();
  const $pacmanPosition = useGameStore.select(state => state.pacmanPosition);
  const $gameStatus = useGameStore.select(state => state.gameStatus);
  const [$position, setPosition] = createSignal<Position>(ghostStartPosition);
  const [$direction, setDirection] = createSignal<Direction>(DIRECTION.LEFT);
  const [$color, setColor] = createSignal<string>(props.color);
  const [$changeDirectionWaitingTime, setChangeDirectionWaitingTime] = createSignal(0);
  setInterval(move, 100);

  onMount(() => {
    document.addEventListener("restart-game", gameRestarted);
  });

  onDispose(() => {
    document.removeEventListener("restart-game", gameRestarted);
  });

  function gameRestarted() {
    setColor(props.color);
    setPosition(ghostStartPosition);
  }

  function move() {
    if ($gameStatus.value === GAME_STATUS.IN_PROGRESS) {
      if ($changeDirectionWaitingTime.value > 4) {
        const movement = Math.floor(Math.random() * 4) + 0;
        const arrayOfMovement: Direction[] = [
          DIRECTION.LEFT,
          DIRECTION.UP,
          DIRECTION.DOWN,
          DIRECTION.RIGHT,
        ];
        setDirection(arrayOfMovement[movement]);
        setChangeDirectionWaitingTime(0);
      } else {
        setChangeDirectionWaitingTime((oldChangeDirectionWaitingTime) => {
          return oldChangeDirectionWaitingTime + 1;
        });
      }

      setPosition((oldPosition: Position) => {
        const currentLeft = oldPosition.left;
        const currentTop = oldPosition.top;
        let newPosition: Position = { top: 0, left: 0 };

        switch ($direction.value) {
          case DIRECTION.LEFT:
            newPosition = {
              top: currentTop,
              left: Math.max(currentLeft - props.velocity.value, 0),
            };
            break;
          case DIRECTION.UP:
            newPosition = {
              top: Math.max(currentTop - props.velocity.value, 0),
              left: currentLeft,
            };
            break;
          case DIRECTION.RIGHT:
            newPosition = {
              top: currentTop,
              left: Math.min(
                currentLeft + props.velocity.value,
                window.innerWidth - props.border - props.size
              ),
            };
            break;

          default:
            newPosition = {
              top: Math.min(
                currentTop + props.velocity.value,
                window.innerHeight -
                  props.size -
                  props.border -
                  props.topScoreBoard
              ),
              left: currentLeft,
            };
        }
        if (
          $pacmanPosition.value.left > newPosition.left - props.size &&
          $pacmanPosition.value.left < newPosition.left + props.size &&
          $pacmanPosition.value.top > newPosition.top - props.size &&
          $pacmanPosition.value.top < newPosition.top + props.size
        ) {
          setGameStatus(GAME_STATUS.LOST);
        }

        return newPosition;
      });
    }
    if (
      $gameStatus.value !== GAME_STATUS.PAUSED &&
      $gameStatus.value !== GAME_STATUS.IN_PROGRESS
    ) {
      setColor(COLOR.GHOST_DEAD);
    }
  }

  return (
    <GhostBody  position={$position}>
      <GhostIcon color={$color}/>
    </GhostBody>
  );
};

const GhostBody: FC<{ position: ISubscribableSignal<Position>, }> = ({ position }, children) => {
  const $positionTop = derivedSignal(position, (position) => `${position.top}px`);
  const $positionLeft = derivedSignal(position, (position) => `${position.left}px`);
  return (<div style={{
      width: '60px',
      height: '63px',
      position: 'absolute',
      top: $positionTop as unknown as string,
      left:  $positionLeft as unknown as string,
    }}> { children }
 </div>);
}

// svg {
//   fill: ${(props) => {
//     switch (props.color) {
//       case COLOR.RED:
//         return COLOR.RED;
//       case COLOR.BLUE:
//         return COLOR.BLUE;
//       case COLOR.ORANGE:
//         return COLOR.ORANGE;
//       case COLOR.GREEN:
//         return COLOR.GREEN;
//       default:
//         return COLOR.GHOST_DEAD;
//     }
//   }};
// }
export default Ghost;