import { describe, beforeEach, test, expect } from "vitest";
import { renderSignalValue } from "./render-signal-value";
import { SignalSubscriptionDetails } from "../models";

describe("renderSignalValue", () => {
  let container: HTMLElement;
  let signal: Partial<SignalSubscriptionDetails>;

  beforeEach(() => {
    container = document.createElement("div");
    signal = {
      containerElement: container,
      connected: true,
    };
  });

  test("renders signal value as text content for Text nodes", () => {
    const signalValue = "Hello, world!";
    container.appendChild(document.createTextNode(""));
    renderSignalValue(signalValue, signal as SignalSubscriptionDetails);

    expect(container.textContent).toBe(signalValue);
  });

  test("renders signal value as inner HTML for string values", () => {
    const signalValue = "<strong>Hello, world!</strong>";
    renderSignalValue(signalValue, signal as SignalSubscriptionDetails);

    expect(container.innerHTML).toBe(signalValue);
  });

  test("renders signal value as child element for HTMLElement values", () => {
    const signalValue = document.createElement("strong");
    signalValue.textContent = "Hello, world!";
    renderSignalValue(signalValue, signal as SignalSubscriptionDetails);

    expect(container.innerHTML).toBe("<strong>Hello, world!</strong>");
  });

  test("renders signal value as text content for other values", () => {
    const signalValue = 42;
    renderSignalValue(signalValue, signal as SignalSubscriptionDetails);

    expect(container.textContent).toBe(signalValue.toString());
  });

  test("clears container for null or undefined signal values", () => {
    container.innerHTML = "<strong>Hello, world!</strong>";
    renderSignalValue(null, signal as SignalSubscriptionDetails);

    expect(container.innerHTML).toBe("");

    container.innerHTML = "<strong>Hello, world!</strong>";
    renderSignalValue(undefined, signal as SignalSubscriptionDetails);

    expect(container.innerHTML).toBe("");
  });

  test("does not render if container is null or undefined", () => {
    signal.containerElement = null;
    renderSignalValue("Hello, world!", signal as SignalSubscriptionDetails);

    expect(container.innerHTML).toBe("");

    signal.containerElement = undefined;
    renderSignalValue("Hello, world!", signal as SignalSubscriptionDetails);

    expect(container.innerHTML).toBe("");
  });

  test("does not render if signal is not connected", () => {
    signal.connected = false;
    renderSignalValue("Hello, world!", signal as SignalSubscriptionDetails);

    expect(container.innerHTML).toBe("");
  });
});