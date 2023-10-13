import { Position, pacmanStartPosition } from "../types/position";
import { GAME_STATUS, GameStatus } from "../types/gameStatus";
import { DIFFICULTY, Difficulty } from "../types/difficulty";
import { createSignalStore } from "@sigjs/store";

type GameStore = {
  onGameRestart: number;
  foodAmount: number;
  gameStatus: GameStatus;
  pacmanPosition: Position;
  points: number;
  difficulty: Difficulty;
  setFoodAmount: (foodAmount: number) => void;
  setPacmanPosition: (position: Position) => void;
  setPoints: (points: number) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setGameStatus: (gameStatus: GameStatus) => void;
  restartGame: () => void;
};



export const useGameStore = createSignalStore<GameStore>((set) => {
  return {
    onGameRestart: 0,
    foodAmount: 10,
    gameStatus: GAME_STATUS.PAUSED,
    pacmanPosition: { top: 0, left: 0 },
    points: 0,
    difficulty: DIFFICULTY.MEDIUM,
    setFoodAmount: (foodAmount: number) => {
      set({ foodAmount });
    },
    setPacmanPosition: (pacmanPosition: Position) => {
      set({ pacmanPosition });
    },
    setPoints: (points: number) => {
      set({ points });
    },
    setDifficulty: (difficulty: Difficulty) => {
      set({ difficulty });
    },
    setGameStatus: (gameStatus: GameStatus) => {
      set({ gameStatus });
    },
    restartGame: () => {
      set((state) => ({ points: 0, gameStatus: GAME_STATUS.IN_PROGRESS, onGameRestart: state.onGameRestart+1 }));
    },
  };

});

// export function GameProvider({ children }: Props) {
//   const [pacmanPosition, _setPacmanPosition] = useState<Position>(
//     contextDefaultValues.pacmanPosition
//   );
//   const [points, _setPoints] = useState<number>(contextDefaultValues.points);
//   const [foodAmount, _setFoodAmount] = useState<number>(
//     contextDefaultValues.foodAmount
//   );

//   const [difficulty, _setDifficulty] = useState<Difficulty>(
//     contextDefaultValues.difficulty
//   );

//   const [gameStatus, _setGameStatus] = useState<GameStatus>(
//     contextDefaultValues.gameStatus
//   );

//   const setFoodAmount = (foodAmount: number) => {
//     _setFoodAmount(foodAmount);
//   };

//   const setGameStatus = (gameStatus: GameStatus) => {
//     _setGameStatus(gameStatus);
//   };

//   const setPacmanPosition = (pacmanPosition: Position) => {
//     _setPacmanPosition(pacmanPosition);
//   };
//   const setPoints = (points: number) => {
//     _setPoints(points);
//   };

//   const setDifficulty = (difficulty: Difficulty) => {
//     _setDifficulty(difficulty);
//   };

//   const restartGame = () => {
//     _setPoints(0);
//     _setGameStatus(GAME_STATUS.IN_PROGRESS);
//     _setPacmanPosition(pacmanStartPosition);

//     const event = new Event("restart-game");
//     document.dispatchEvent(event);
//   };

//   const value = {
//     foodAmount,
//     gameStatus,
//     pacmanPosition,
//     points,
//     difficulty,
//     restartGame,
//     setFoodAmount,
//     setGameStatus,
//     setPacmanPosition,
//     setPoints,
//     setDifficulty,
//   };

//   return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
// }
