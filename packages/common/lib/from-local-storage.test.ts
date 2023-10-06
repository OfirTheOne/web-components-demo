import { Signal } from "@sigjs/signal";
import { fromLocalStorage } from "./from-local-storage";
import { describe, it, expect, vi } from "vitest";
import { afterEach } from "node:test";
// import * as tinyspy from "tinyspy";

describe("fromLocalStorage", () => {
  let lsSignal: Signal<string>
  afterEach(() => {
    lsSignal.subscribe(() => { void 0; });
    localStorage.clear();
  });
  it("should return a signal with the value from localStorage and add storage listener", () => {
    const key = "test-key";
    const value = "test-value";
    localStorage.setItem(key, value);
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    lsSignal = fromLocalStorage(key);
    const handler = addEventListenerSpy.mock.calls[0].at(-1);

    expect(lsSignal.value).toBe(value);
    expect(handler).toBeInstanceOf(Function);

  });
  it("should update the signal when localStorage is updated", async () => {
    const key = "test-key";
    const value = "test-value";
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");

    localStorage.setItem(key, value);
    lsSignal = fromLocalStorage(key);
    const handler = addEventListenerSpy.mock.calls[0].at(-1);

    expect(lsSignal.value).toBe(value);
    expect(handler).toBeInstanceOf(Function);

    const newValue = "new-value";
    localStorage.setItem(key, newValue);

    // eslint-disable-next-line @typescript-eslint/ban-types
    (handler as Function).call(window,
      new StorageEvent("storage", {
        key,
        newValue,
        oldValue: value,
        storageArea: localStorage,
      })
    );
    expect(lsSignal.value).toBe(newValue);
  });
  it("should unsubscribe from storage event when signal is unsubscribed", () => {
    const key = "test-key";
    const value = "test-value";
    localStorage.setItem(key, value);

    lsSignal = fromLocalStorage(key);

    const spy = vi.spyOn(window, "removeEventListener");

    lsSignal.unsubscribe(() => { void 0; });
    expect(spy).toHaveBeenCalledWith("storage", expect.any(Function));
  });
});