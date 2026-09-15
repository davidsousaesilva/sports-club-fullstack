import { QueryProvider, RouterProvider, ThemeProvider } from "./providers";

function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <RouterProvider />
      </QueryProvider>
    </ThemeProvider>
  );
}

export { App };
