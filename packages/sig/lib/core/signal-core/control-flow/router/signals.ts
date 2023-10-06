import { history } from "../../../../common/router";
import { signal } from "@sigjs/signal";

export const locationSignal = signal(history.currentLocation);
history.addStateChangedListener((_state, location) => {
    locationSignal.setValue(() => location);
});
