import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';

import { BatchSettings } from './batch-settings';
import { HooksSettings } from './hooks-settings';
import { MiscSettings } from './misc-settings';

export const Settings = () => {
  const { url } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${url}/batch`} component={BatchSettings} />
      <Route path={`${url}/misc`} component={MiscSettings} />
      <Route path={`${url}/hook`} component={HooksSettings} />
      <Redirect to={`${url}/batch`} />
    </Switch>
  )
}
