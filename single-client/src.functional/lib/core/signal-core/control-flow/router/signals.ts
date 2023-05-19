import { history } from "../../../router";
import { signal } from "../../create-signal/create-signal";

export const locationSignal = signal(history.currentLocation);
history.addStateChangedListener((_state, location) => {
    locationSignal.setValue(() => location);
});
