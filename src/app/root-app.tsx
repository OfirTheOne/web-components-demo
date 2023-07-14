import { ThemeProvider } from './providers';
import { App } from './app';

export function RootApp() {
  return (
    <div>
      <ThemeProvider>
        <App/>
      </ThemeProvider>
    </div>
  );
}