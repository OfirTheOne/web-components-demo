import { describe, beforeEach, test, expect } from "vitest";
import { renderSignalContent } from "./render-signal-content";
import { SignalSubscriptionDetails } from "../models";

describe("renderSignalContent", () => {
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
    renderSignalContent(signalValue, undefined, signal as SignalSubscriptionDetails);
    expect(container.textContent).toBe(signalValue);
  });

  test("renders signal value as inner HTML for string values", () => {
    const signalValue = "<strong>Hello, world!</strong>";
    renderSignalContent(signalValue, undefined, signal as SignalSubscriptionDetails);
    expect(container.innerHTML).toBe(signalValue);
  });

  test("renders signal value as child element for HTMLElement values", () => {
    const signalValue = document.createElement("strong");
    signalValue.textContent = "Hello, world!";
    renderSignalContent(signalValue, undefined, signal as SignalSubscriptionDetails);
    expect(container.innerHTML).toBe("<strong>Hello, world!</strong>");
  });

  test("renders signal value as text content with string conversion for object values", () => {
    const signalValue = { toString: () => "Hello, world!" };
    renderSignalContent(signalValue, undefined, signal as SignalSubscriptionDetails);
    expect(container.textContent).toBe("Hello, world!");
  });

  test("renders signal value as text content for other values", () => {
    const signalValue = 42;
    renderSignalContent(signalValue, undefined, signal as SignalSubscriptionDetails);
    expect(container.textContent).toBe(String(signalValue));
  });

  test("clears container for null or undefined signal values", () => {
    container.innerHTML = "<strong>Hello, world!</strong>";
    renderSignalContent(null, undefined, signal as SignalSubscriptionDetails);
    expect(container.innerHTML).toBe("");

    container.innerHTML = "<strong>Hello, world!</strong>";
    renderSignalContent(undefined, undefined, signal as SignalSubscriptionDetails);
    expect(container.innerHTML).toBe("");
  });

  test("does not render if container is null or undefined", () => {
    signal.containerElement = null;
    renderSignalContent("Hello, world!", undefined, signal as SignalSubscriptionDetails);
    expect(container.innerHTML).toBe("");

    signal.containerElement = undefined;
    renderSignalContent("Hello, world!", undefined, signal as SignalSubscriptionDetails);
    expect(container.innerHTML).toBe("");
  });

  test("does not render if signal is not connected", () => {
    signal.connected = false;
    renderSignalContent("Hello, world!", undefined, signal as SignalSubscriptionDetails);
    expect(container.innerHTML).toBe("");
  });


  
});