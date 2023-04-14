import { WC } from '../lib/jsx';
import { createContext, createRef, useContext } from '../lib/core';
import './theme.scss';

const ThemeContext = createContext({
  theme: 'light',
  // eslint-disable-next-line
  setTheme: (_theme: string) => {},
});

export const ThemeProvider = (_props, children) => {
  const [getTheme, setTheme] = createRef('light');
  const Provider = ThemeContext.Provider;

  return (
    <Provider value={{ theme: getTheme(), setTheme }}>
      <div className={getTheme()}>
        {children}
      </div>
    </Provider>
  );
};

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  return theme;
};

// export {}
