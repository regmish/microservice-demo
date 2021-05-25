import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';

import { Dashboard, Login, Layout } from './pages';
import { isLoggedIn } from './utils/auth';

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn() ? (
          <Layout>
            <Component {...props} />
          </Layout>
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        )
      }
    />
  );
};

const Routes = () => {
  const loginRedirect = () =>
    isLoggedIn() ? (
      <Redirect to="/" />
    ) : (
      <Route path="/login" component={Login} />
    );
  return (
    <Switch>
      <PrivateRoute exact path="/" component={Dashboard} />
      <Route exact path="/" render={loginRedirect} />
      <Route exact path="/login" render={loginRedirect} />
      <Redirect to="/" />
    </Switch>
  );
};

export default withRouter(Routes);
