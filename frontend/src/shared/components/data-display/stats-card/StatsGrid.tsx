import type { ReactNode } from "react";

interface StatsGridProps {
  children: ReactNode;
  cols?: 2 | 3 | 4 | 5;
}

function StatsGrid({ children, cols = 4 }: StatsGridProps) {
  const className =
    cols === 2
      ? "grid grid-cols-1 gap-4 md:grid-cols-2"
      : cols === 3
        ? "grid grid-cols-1 gap-4 md:grid-cols-3"
        : cols === 5
          ? "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5"
          : "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4";

  return <div className={className}>{children}</div>;
}

export { StatsGrid };
