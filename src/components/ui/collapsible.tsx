import { Collapsible as CollapsiblePrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';

const Collapsible = (props: ComponentProps<typeof CollapsiblePrimitive.Root>) => (
  <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
);
const CollapsibleTrigger = (props: ComponentProps<typeof CollapsiblePrimitive.Trigger>) => (
  <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
);
const CollapsibleContent = (props: ComponentProps<typeof CollapsiblePrimitive.Content>) => (
  <CollapsiblePrimitive.Content data-slot="collapsible-content" {...props} />
);
export { Collapsible, CollapsibleContent, CollapsibleTrigger };
