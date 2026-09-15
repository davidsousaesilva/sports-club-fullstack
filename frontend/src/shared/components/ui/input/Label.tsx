import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "../../../../lib/utils/cn";

type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;

function Label({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      className={cn("text-sm font-medium text-slate-700", className)}
      {...props}
    />
  );
}

export { Label };
export type { LabelProps };
