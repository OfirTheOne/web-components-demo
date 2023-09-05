import { ThemeProvider } from './providers';
import { Layout } from './spotify-demo/layout/layout';


export function ExamplePage() {
  return (
    <div>
      <ThemeProvider>
        <Layout />
      </ThemeProvider>
    </div>
  );
}



