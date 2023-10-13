import "./Header.scss";
import { onMount } from "@sigjs/sig";
import { createSignal } from "@sigjs/signal";
import { useGameStore } from "../store/game.store";
import { GAME_STATUS } from "../types/gameStatus";

const Header = () => {
  const { points, foodAmount, gameStatus } = useGameStore.getState();
  const [timeElapsed, setTimeElapsed] = createSignal(0);

  onMount(() => {
    document.addEventListener("restart-game", gameRestarted);
    return () => document.removeEventListener("restart-game", gameRestarted);
  });

  function gameRestarted() {
    setTimeElapsed(0);
  }

  setInterval(() => {
    if (gameStatus === GAME_STATUS.IN_PROGRESS) {
      setTimeElapsed((previousTime) => {
        return previousTime + 1;
      });
    }
  }, 1000);

  return (
    <div className="header">
      <span className="left title">PACMAN</span>
      <div className="right score">
        <div>
          <strong>Score: </strong>
          <span className="points">
            {points} / {foodAmount}
          </span>
        </div>
        <div>
          <strong>Time elapsed: </strong>
          <span className="points">{timeElapsed}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
