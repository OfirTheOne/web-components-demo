import { Case, FC, Switch, onMount } from "@sigjs/sig";
import "./Scene.scss";

import FoodLayer from "./FoodLayer";
import CharacterLayer from "./CharacterLayer";

import colors from "../styles/Colors";
import { useGameStore } from "../store/game.store";
import { GAME_STATUS } from "../types/gameStatus";
import { DIFFICULTY, Difficulty } from "../types/difficulty";


type SceneProps = {
  foodSize: number;
  border: number;
  topScoreBoard: number;
};

const pacmanSize = 60;

const Scene = (props: SceneProps) => {
  const {
    setFoodAmount,
    restartGame,
    setDifficulty,
    setGameStatus,
  } = useGameStore.getState();

  const $gameStatus = useGameStore.select(state => state.gameStatus);
  const $difficulty = useGameStore.select(state => state.difficulty);

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
    <div className="scene-container">
      <div className="overlay-content">
        <Switch track={[$gameStatus]}>
          <Case when={([gameStatus]) => gameStatus === GAME_STATUS.PAUSED}>
            <div className="center-container" >
              <div> <span>Set Difficulty</span> </div>
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
            <PlayButton onClick={() => setGameStatus(GAME_STATUS.IN_PROGRESS)} text={"Play!"} />
            </div>
          </Case>
          <Case when={([gameStatus]) => gameStatus === GAME_STATUS.WON}>
            <div className="center-container" >
              <div>
                <strong>Congratulations :)</strong>
              </div>
              <PlayButton onClick={() => restartGame()} text={'Play again'} />
            </div>
          </Case>
          <Case when={([gameStatus]) => gameStatus === GAME_STATUS.LOST}>
            <div className="center-container" >
              <div>
                <strong>GAME OVER :(</strong>
              </div>
              <PlayButton onClick={() => restartGame()} text={'Try Again'} />
            </div>
          </Case>
        </Switch>
      </div>
      <FoodLayer pacmanSize={pacmanSize} {...props} />
      <CharacterLayer />
    </div>
  );
};


const PlayButton: FC<JSX.HTMLAttributes<HTMLButtonElement> & { text: string }> = (props) => <button
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
>{props.text}
</button>;

export default Scene;
