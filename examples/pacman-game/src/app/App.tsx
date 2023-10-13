import { render } from "@sigjs/sig";
import "./App.css";
import Header from "./components/Header";
import Scene from "./components/Scene";

function App() {
  return (
    <div className="pacman-app">
        <Header />
        <Scene foodSize={60} border={20} topScoreBoard={100} />
    </div>
  );
}

render(<App />, 'root');
