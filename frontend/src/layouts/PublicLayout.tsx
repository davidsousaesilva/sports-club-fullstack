import { Outlet } from "react-router";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  );
}

export { PublicLayout };
