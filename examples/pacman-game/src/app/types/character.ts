import { ISignal } from "@sigjs/signal";

export type Character = {
  velocity: ISignal<number>;
  size: number;
  border: number;
  topScoreBoard: number;
  color: string;
  name: string;
};
