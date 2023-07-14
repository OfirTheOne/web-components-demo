import { WC } from '../lib/jsx';
import { render } from '../lib/core';

import { RootApp } from './root-app';

window.onload = () => {
  render(<RootApp />, 'root');
};