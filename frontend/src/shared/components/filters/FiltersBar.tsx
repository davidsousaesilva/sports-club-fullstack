import { ReactNode } from "react";
import { Card, CardContent } from "../ui/card/Card";

interface FiltersBarProps {
  children: ReactNode;
  cols?: 2 | 3 | 4;
  className?: string;
}

const gridColsMap: Record<2 | 3 | 4, string> = {
  2: "xl:grid-cols-[minmax(0,1.5fr)_1fr]",
  3: "xl:grid-cols-[minmax(0,1.5fr)_repeat(2,1fr)]",
  4: "xl:grid-cols-[minmax(0,1.5fr)_repeat(3,1fr)]",
};

function FiltersBar({ children, cols = 4, className }: FiltersBarProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div
          className={["grid items-center gap-4", gridColsMap[cols], className]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

export { FiltersBar };
