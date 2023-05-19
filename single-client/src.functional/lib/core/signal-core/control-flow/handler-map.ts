import { ControlFlow } from "../models";
import { ForControlFlowComponentContainer } from "./for/for.container";
import { RouteControlFlowComponentContainer } from "./router/route/route.container";
import { ShowControlFlowComponentContainer } from "./show/show.container";
import { SlotControlFlowComponentContainer } from "./slot/slot.container";
import { SwitchControlFlowComponentContainer } from "./switch/switch.container";


export const CONTROL_FLOW_HANDLER_MAP = {
  [Symbol.for(ControlFlow.Switch)]: SwitchControlFlowComponentContainer,
  [Symbol.for(ControlFlow.Show)]: ShowControlFlowComponentContainer,
  [Symbol.for(ControlFlow.Slot)]: SlotControlFlowComponentContainer,
  [Symbol.for(ControlFlow.For)]: ForControlFlowComponentContainer,
  [Symbol.for(ControlFlow.Route)]: RouteControlFlowComponentContainer,
} as const;
