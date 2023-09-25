import { render } from 'sig';

import { RootApp } from './root-app';

window.onload = () => {
  render(<RootApp />, 'root');
};
