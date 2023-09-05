import { history } from "../../../../common/router";
import { signal } from "../../signal/create-signal";

export const locationSignal = signal(history.currentLocation);
history.addStateChangedListener((_state, location) => {
    locationSignal.setValue(() => location);
});