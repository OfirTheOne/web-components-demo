import { DynamicTemplate } from "../models";
import { ShowDynamicTemplateComponentContainer } from "./show/show.container";
import { SlotDynamicTemplateComponentContainer } from "./slot/slot.container";


export const DYNAMIC_TEMPLATE_HANDLER_MAP= {
  [Symbol.for(DynamicTemplate.Show)]: ShowDynamicTemplateComponentContainer,
  [Symbol.for(DynamicTemplate.Slot)]: SlotDynamicTemplateComponentContainer,
} as const;
