import { intervalBuffer } from "./interval-buffer";
import { signal } from "./../create-signal";
import { describe, it, expect, vi } from "vitest";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("intervalBuffer", () => {
  it("should buffer all 3 values for 1000 ms and take last value in the interval.", async () => {
    const source = signal<string>()
    const bufferSignal = intervalBuffer(source, 1000, true);

    const spy = vi.fn();
    bufferSignal.subscribe(spy);

    source.setValue("A");
    await delay(100);
    source.setValue("B");
    await delay(100);
    source.setValue("C");
    await delay(900);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("C");
  }, 5*1000);
  it("should buffer first 2 values and emit 2nd then buffered 3rd value and emit only last value in the interval.", async () => {
    const source = signal<string>()
    const bufferSignal = intervalBuffer(source, 1000, true);

    const spy = vi.fn();
    bufferSignal.subscribe(spy);

    source.setValue("A");
    await delay(500);
    source.setValue("B");
    await delay(500);
    source.setValue("C");
    await delay(1050);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(1, "B");
    expect(spy).toHaveBeenNthCalledWith(2, "C");
  }, 5*1000);
  it("should buffer all 3 values for 1000 ms and emit all three values in the interval.", async () => {
    const source = signal<string>()
    const bufferSignal = intervalBuffer(source, 1000);

    const spy = vi.fn();
    bufferSignal.subscribe(spy);

    source.setValue("A");
    await delay(100);
    source.setValue("B");
    await delay(100);
    source.setValue("C");
    await delay(900);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(["A", "B", "C"]);
  }, 5*1000);
  it("should buffer first 2 values and emit both, then buffered third value and emit array with this value.", async () => {
    const source = signal<string>()
    const bufferSignal = intervalBuffer(source, 1000);

    const spy = vi.fn();
    bufferSignal.subscribe(spy);

    source.setValue("A");
    await delay(500);
    source.setValue("B");
    await delay(500);
    source.setValue("C");
    await delay(1050);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(1, ["A","B"]);
    expect(spy).toHaveBeenNthCalledWith(2, ["C"]);
  }, 5*1000);
});
