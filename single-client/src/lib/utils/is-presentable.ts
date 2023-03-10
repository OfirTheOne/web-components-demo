import { Presentable } from "../core/presentable";
import { Ctor } from "../models/ctor";

  export function isPresentable(
    maybePresentable: Function
  ): maybePresentable is Ctor<Presentable> {
    return maybePresentable.prototype instanceof Presentable;
  }