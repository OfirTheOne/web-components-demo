import { WC } from '../../../lib/jsx';
import { createContext, createRef, createState, useContext } from '../../../lib/core';
import './theme.scss';

const StateContext = createContext({
  theme: 'light',
  // eslint-disable-next-line
  setTheme: (_theme: string) => {},
});

export const StateProvider = (_props, children) => {
  const [getTheme, setTheme] = createState('light');
  const Provider = StateContext.Provider;

  
  return (
    <Provider value={{ theme: getTheme(), setTheme }}>
        {children}
    </Provider>
  );
};

export const useTheme = () => {
  const theme = useContext(StateContext);
  return theme;
};

