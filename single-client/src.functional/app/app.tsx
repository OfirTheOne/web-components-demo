
import { WC } from "../lib/jsx";
import { ThemeProvider, useTheme } from "./theme-context";
import { Game } from "./tic-tac-toe";


export function App() {


    return (
        <div>
            <ThemeProvider>
                <Title/>
                <Game />
            </ThemeProvider>
        </div>
    );
}
   


export function Title() {

    const themeCtx = useTheme();
    return (
        <h1>TicTacToe Example { themeCtx.theme }</h1> 
    );
}
   

