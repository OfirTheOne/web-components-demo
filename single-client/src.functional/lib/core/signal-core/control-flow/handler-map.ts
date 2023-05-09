import { ControlFlow } from "../models";
import { ShowControlFlowComponentContainer } from "./show/show.container";
import { SlotControlFlowComponentContainer } from "./slot/slot.container";


export const CONTROL_FLOW_HANDLER_MAP= {
  [Symbol.for(ControlFlow.Show)]: ShowControlFlowComponentContainer,
  [Symbol.for(ControlFlow.Slot)]: SlotControlFlowComponentContainer,
} as const;
