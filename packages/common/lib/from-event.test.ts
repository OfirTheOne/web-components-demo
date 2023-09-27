import { fromEvent } from "./from-event";
import { describe, it, expect, vi } from "vitest";

describe("fromEvent", () => {
  it("should return a signal that emits when the event is triggered", () => {
    const target = document.createElement("div");
    const type = "click";
    const signal = fromEvent(target, type);

    const spy = vi.fn();
    signal.subscribe(spy);

    target.dispatchEvent(new MouseEvent(type));
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it("should return a signal mapped value that emits when the event is triggered", () => {
    const target = document.createElement("div");
    const type = "click";
    const signal = fromEvent(target, type, undefined, ((e: MouseEvent) => [e.clientX, e.clientY] as const));

    const spy = vi.fn();
    signal.subscribe(spy);

    target.dispatchEvent(new MouseEvent(type, { clientX: 1, clientY: 2 }));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(signal.value).toEqual([1, 2]);
  });
  it("should unsubscribe from the event when the signal is unsubscribed", () => {
    const target = document.createElement("div");
    const type = "click";
    const signal = fromEvent(target, type);

    const spy = vi.spyOn(target, "removeEventListener");
    signal.unsubscribe(()=>{void 0;});

    expect(spy).toHaveBeenCalledWith(type, expect.any(Function), undefined);
  });
});