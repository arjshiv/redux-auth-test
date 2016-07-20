/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a neccessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
// material ui theme 
import { OAuthSignInButton } from 'redux-auth/material-ui-theme';

export default class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  //uncomment the OAuthSignInButton to see the issue
  render() {
    return (
      <div>
        <h1>This is the Homepage!</h1>
        {/*<OAuthSignInButton provider='github' endpoint='www.google.com'/>*/}
      </div>
    );
  }
}
