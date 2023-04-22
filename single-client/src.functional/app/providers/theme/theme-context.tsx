import { WC } from '../../../lib/jsx';
import { createContext, createRef, createState, useContext } from '../../../lib/core';
import './theme.scss';

const ThemeContext = createContext({
  theme: 'light',
  // eslint-disable-next-line
  setTheme: (_theme: string) => {},
});

export const ThemeProvider = (_props, children) => {
  const [getTheme, setTheme] = createState('light');
  const Provider = ThemeContext.Provider;

  return (
    <Provider value={{ theme: getTheme(), setTheme }}>
        {children}
    </Provider>
  );
};

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  return theme;
};

