

import Pacman from "./Pacman";
import Ghost from "./Ghost";
import colors from "../styles/Colors";
import { COLOR } from "../types/color";

const pacmanSize = 60;
const pacmanVelocity = 30;
const ghostSize = 60;
const topScoreBoardHeight = 100;
const ghostVelocity = 20;

const CharacterLayer = () => {
    // const $difficulty = useGameStore.select(state => state.difficulty);

    // $difficulty.subscribe((difficulty) => {
    //   if (difficulty === DIFFICULTY.EASY) {
    //     setGhostVelocity(15);
    //   }
    //   if (difficulty === DIFFICULTY.MEDIUM) {
    //     setGhostVelocity(20);
    //   }
    //   if (difficulty === DIFFICULTY.ADVANCED) {
    //     setGhostVelocity(30);
    //   }
    // });

    return <>
          <Pacman
        velocity={pacmanVelocity}
        size={pacmanSize}
        border={20}
        topScoreBoard={topScoreBoardHeight}
        name="pacman"
        color={colors.color2}
      ></Pacman>
      <Ghost
        velocity={ghostVelocity}
        size={ghostSize}
        border={20}
        topScoreBoard={topScoreBoardHeight}
        color={COLOR.RED}
        name="ghost1"
      ></Ghost>
      <Ghost
        velocity={ghostVelocity}
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
      </>
}

export default CharacterLayer;