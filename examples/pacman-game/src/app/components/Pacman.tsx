
import { Position } from "../types/position";
import { ARROW, DIRECTION, Direction } from "../types/direction";
import { Character } from "../types/character";
import { useGameStore } from "../store/game.store";
import { COLOR } from "../types/color";
import { GAME_STATUS } from "../types/gameStatus";
import colors from "../styles/Colors";
import { FC, ISubscribableSignal, createSignal, derivedSignal, onMount } from "@sigjs/sig";

import './Pacman.scss'

const Pacman = (props: Character) => {
  const {
    setPacmanPosition,
  } = useGameStore.getState();
const $pacmanPosition = useGameStore.select(state => state.pacmanPosition);
const $gameStatus = useGameStore.select(state => state.gameStatus);


  const [$direction, setDirection] = createSignal<Direction>(DIRECTION.RIGHT);
  const [$color, setColor] = createSignal<string>(props.color);
  setInterval(move, 100);

  onMount(() => {
    function rotate(keypressed: number) {
      switch (keypressed) {
        case ARROW.LEFT:
          setDirection(DIRECTION.LEFT);
          break;
        case ARROW.UP:
          setDirection(DIRECTION.UP);
          break;
        case ARROW.RIGHT:
          setDirection(DIRECTION.RIGHT);
          break;
        default:
          setDirection(DIRECTION.DOWN);
      }
    }

    function handleKeyDown(e: any) {
      const arrows = [ARROW.LEFT, ARROW.UP, ARROW.RIGHT, ARROW.DOWN];

      if (arrows.indexOf(e.keyCode) >= 0) {
        rotate(e.keyCode);
      }
    }

    document.addEventListener("keydown", handleKeyDown, false);
    document.addEventListener("restart-game", gameRestarted);

    return () => {
      document.removeEventListener("restart-game", gameRestarted);
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  function gameRestarted() {
    setColor(props.color);
  }

  function move() {
    if ($gameStatus.value === GAME_STATUS.IN_PROGRESS) {
      const currentLeft = $pacmanPosition.value.left;
      const currentTop = $pacmanPosition.value.top;
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
      setPacmanPosition(newPosition);
    }
    if ($gameStatus.value === GAME_STATUS.LOST) {
      setColor(COLOR.PACMAN_DEAD);
    }
  }

  return (
    <PacmanBody $position={$pacmanPosition} $direction={$direction}>
      <PacmanEye />
      <PacmanMouth />
    </PacmanBody>
  );
};


const PacmanBody: FC<{ $color?: ISubscribableSignal<string>, $position: ISubscribableSignal<Position>, $direction: ISubscribableSignal<DIRECTION> }> = ({
  $position,
  $direction,
}, children) => {

  const $background = derivedSignal(useGameStore.select(state => state.gameStatus), 
    (status) => status !== GAME_STATUS.LOST ? colors.color2 : "white");
  const $positionLeft = derivedSignal($position, (position) => `${position.left}px`);
  const $positionTop = derivedSignal($position, (position) => `${position.top}px`);
  const $transform = derivedSignal($direction, (direction) => {
    switch (direction) {
      case DIRECTION.LEFT:
        return "rotateY(180deg)";
      case DIRECTION.UP:
        return "rotate(-90deg)";
      case DIRECTION.DOWN:
        return "rotate(90deg)";
      default:
        return "rotate(0deg)";
    }
  });
return ( <div
    style={{
      top: $positionTop as unknown as string,
      left: $positionLeft as unknown as string,
      transform: $transform as unknown as string,
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: $background as unknown as string,
      position: 'relative',
    }}>{ children }</div>);

};


const PacmanEye = () => <div style={{
  position: 'absolute',
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  top: '10px',
  right: '26px',
  background: colors.color1,
}}></div>;

const PacmanMouth: FC = () => {
  const $animationIterationCount = derivedSignal(useGameStore.select(state => state.gameStatus), 
  (status) => status === GAME_STATUS.IN_PROGRESS ? "infinite" : "initial");
return <div
  style={{
    animationName: 'pacman-mouth',
    animationDuration:' 0.7s',
    animationIterationCount: $animationIterationCount as unknown as string,
    background: colors.color1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    clipPath: 'polygon(100% 74%, 44% 48%, 100% 21%)',
  }}
></div>
};

export default Pacman;
