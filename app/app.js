/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */
import 'babel-polyfill';

// TODO constrain eslint import/no-unresolved rule to this block
// Load the manifest.json file and the .htaccess file
import '!file?name=[name].[ext]!./manifest.json';  // eslint-disable-line import/no-unresolved
import 'file?name=[name].[ext]!./.htaccess';      // eslint-disable-line import/no-unresolved

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyRouterMiddleware, Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import useScroll from 'react-router-scroll';
import configureStore from './store';
import {configure} from 'redux-auth';

// Import the CSS reset, which HtmlWebpackPlugin transfers to the build folder
import 'sanitize.css/sanitize.css';

// Create redux store with history
// this uses the singleton browserHistory provided by react-router
// Optionally, this could be changed to leverage a created history
// e.g. `const browserHistory = useRouterHistory(createBrowserHistory)();`
const initialState = {};
const store = configureStore(initialState, browserHistory);

// Sync history and store, as the react-router-redux reducer
// is under the non-default key ("routing"), selectLocationState
// must be provided for resolving how to retrieve the "route" in the state
import { selectLocationState } from 'containers/App/selectors';
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: selectLocationState(),
});

// Needed for onTouchTap
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// Set up the router, wrapping all Routes in the App component
import App from 'containers/App';
import createRoutes from './routes';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const [isServer, cookies, currentLocation] = [false, '', ''];

//Note that this doesn't work when wrapped in a function -> says it can't find 'then' of undefined
store.dispatch(configure(
  // use the FULL PATH to your API
  {apiUrl: "http://api.catfancy.com"},
  {isServer, cookies, currentLocation}
)).then(({redirectPath, blank} = {}) => {
  if (blank) {
    // if `blank` is true, this is an OAuth redirect and should not
    // be rendered
    return <noscript />;
  } else {
    const rootRoute = {
      component: App,
      childRoutes: createRoutes(store),
    };
  
    const reactRoot = document.getElementById('app');
    const appComponent = (
      <MuiThemeProvider>
        <Provider store={store}>
          <Router
            history={history}
            routes={rootRoute}
            render={
              // Scroll to top when going to a new page, imitating default browser
              // behaviour
              applyRouterMiddleware(useScroll())
            }
          />
        </Provider>
      </MuiThemeProvider>
    );
    ReactDOM.render(appComponent, reactRoot);
  }
});

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
import { install } from 'offline-plugin/runtime';
install();
