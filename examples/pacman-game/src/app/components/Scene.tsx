import Pacman from "./Pacman";
import Ghost from "./Ghost";
import FoodLayer from "./Food";
import colors from "../styles/Colors";
import { useGameStore } from "../store/game.store";
import { GAME_STATUS } from "../types/gameStatus";
import { COLOR } from "../types/color";
import { DIFFICULTY, Difficulty } from "../types/difficulty";
import { createSignal, signal } from "@sigjs/signal";
import { Case, FC, Switch, onMount } from "@sigjs/sig";

type SceneProps = {
  foodSize: number;
  border: number;
  topScoreBoard: number;
};

const pacmanSize = 60;
const pacmanVelocity = signal(30);
const ghostSize = 60;
const topScoreBoardHeight = 100;

const Scene = (props: SceneProps) => {
  const {
    setFoodAmount,
    restartGame,
    setDifficulty,
    setGameStatus,
  } = useGameStore.getState();

  const $gameStatus = useGameStore.select(state => state.gameStatus);
  const $difficulty = useGameStore.select(state => state.difficulty);
  const [$ghostVelocity, setGhostVelocity] = createSignal(20);

  $difficulty.subscribe((difficulty) => {
    if (difficulty === DIFFICULTY.EASY) {
      setGhostVelocity(15);
    }
    if (difficulty === DIFFICULTY.MEDIUM) {
      setGhostVelocity(20);
    }
    if (difficulty === DIFFICULTY.ADVANCED) {
      setGhostVelocity(30);
    }
  });

  onMount(() => {
    const amountOfFood =
      Math.floor((window.innerWidth - props.border) / props.foodSize) *
      Math.floor(
        (window.innerHeight - props.border - props.topScoreBoard) /
        props.foodSize
      );

    setFoodAmount(amountOfFood);
  });

  return (
    <SceneContainer>
      <Switch track={[$gameStatus]}>
        <Case when={([gameStatus]) => gameStatus === GAME_STATUS.PAUSED}>
          <OverlayContent>
            <CenterContainer>
              <div>
                <span>Set Difficulty</span>
              </div>
              <div>
                <select
                  value={$difficulty as unknown as string}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                >
                  <option value={DIFFICULTY.EASY}>Easy</option>
                  <option value={DIFFICULTY.MEDIUM}>Medium</option>
                  <option value={DIFFICULTY.ADVANCED}>Advanced</option>
                </select>
              </div>
              <PlayButton onClick={() => setGameStatus(GAME_STATUS.IN_PROGRESS)}>
                Play!
              </PlayButton>
            </CenterContainer>
          </OverlayContent>
        </Case>
        <Case when={([gameStatus]) => gameStatus === GAME_STATUS.WON}>
          <OverlayContent>
            <CenterContainer>
              <div>
                <strong>Congratulations :)</strong>
              </div>
              <PlayButton onClick={() => restartGame()}>
                Play again
              </PlayButton>
            </CenterContainer>
          </OverlayContent>
        </Case>
        <Case when={([gameStatus]) => gameStatus === GAME_STATUS.LOST}>
          <OverlayContent>
            <CenterContainer>
              <div>
                <strong>GAME OVER :(</strong>
              </div>
              <PlayButton onClick={() => restartGame()}>
                Try Again
              </PlayButton>
            </CenterContainer>
          </OverlayContent>
        </Case>
      </Switch>
      <FoodLayer pacmanSize={pacmanSize} { ...props } />
      <Pacman
        velocity={pacmanVelocity}
        size={pacmanSize}
        border={20}
        topScoreBoard={topScoreBoardHeight}
        name="pacman"
        color={colors.color2}
      ></Pacman>
      <Ghost
        velocity={$ghostVelocity}
        size={ghostSize}
        border={20}
        topScoreBoard={topScoreBoardHeight}
        color={COLOR.RED}
        name="ghost1"
      ></Ghost>
      <Ghost
        velocity={$ghostVelocity}
        size={ghostSize}
        border={20}
        topScoreBoard={topScoreBoardHeight}
        color={COLOR.GREEN}
        name="ghost2"
      ></Ghost>
      {/* {difficulty !== DIFFICULTY.EASY && (
        <Ghost
          velocity={$ghostVelocity}
          size={ghostSize}
          border={20}
          topScoreBoard={topScoreBoardHeight}
          color={COLOR.BLUE}
          name="ghost3"
        ></Ghost>
      )}
      {difficulty === DIFFICULTY.ADVANCED && (
        <Ghost
          velocity={$ghostVelocity}
          size={ghostSize}
          border={20}
          topScoreBoard={topScoreBoardHeight}
          color={COLOR.ORANGE}
          name="ghost4"
        ></Ghost>
      )} */}
    </SceneContainer>
  );
};

const CenterContainer = (_props, children) => <div
  style={{
    position: 'absolute',
    margin: '0 auto',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    zIndex: '9999',
    backgroundColor: colors.color2,
    color: colors.color3,
    padding: '20px',
  }}>{children}
</div>;

const OverlayContent = (_props, children) => <div
  style={{
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    fontSize: '40px',
  }}>{children}
</div>;

const SceneContainer = (_props, children) => <div
  style={{
    height: 'calc(100vh - 120px)',
    width: 'calc(100vw - 20px)',
    backgroundColor: 'var(--color1)',
    position: 'relative',
    border: `10px var(--color3) solid`,
  }}>{children}
</div>;

const PlayButton: FC<JSX.HTMLAttributes<HTMLButtonElement>> = (props, children) => <button
  style={{
    padding: '8px 16px',
    fontSize: '24px',
    backgroundColor: colors.color1,
    color: colors.color2,
    border: `1px ${colors.color3} solid`,
    cursor: 'pointer',
    // :hover {
    //   background-color: ${colors.color2};
    //   color: ${colors.color1};
    // }
  }}
  {...props}
>{children}
</button>;

export default Scene;
