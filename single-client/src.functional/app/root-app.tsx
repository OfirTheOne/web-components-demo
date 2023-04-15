import { WC } from '../lib/jsx';
import { ThemeProvider } from './theme-context';
import { App } from './app';

export function RootApp() {
  return (
      <ThemeProvider>
        <App/>
      </ThemeProvider>
  );
}