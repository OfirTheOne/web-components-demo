
import { HomePage } from '../pages/home-page/home-page';
import { Route } from '@lib/core/signal-core/control-flow/router';


export function Routes() {
  return (
    <>
      <Route path='/home'>
        {
          () => <HomePage />
        }
      </Route >
      <Route path='/search'>
        {
          () => <h2>Search</h2>
        }
      </Route >
      <Route path='/library'>
        {
          () => <h2>Library</h2>
        }
      </Route >
      <Route path='/songs'>
        {
          () => <h2>Songs</h2>
        }
      </Route >
    </>
  );
}

