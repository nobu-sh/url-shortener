import React from "react"
import {
  BrowserRouter,
  Route,
  Switch,
} from "react-router-dom"

import Landing from '../views/Landing'
import Init from '../views/auth/Init'
import Auth from '../views/auth/Auth'
import Dashboard from '../views/Dashboard'
import SignUp from '../views/auth/SignUp'
import NotFound from '../views/404'

export default () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/">
        <Landing />
      </Route>
      <Route exact path="/init">
        <Init />
      </Route>
      <Route exact path="/auth">
        <Auth />
      </Route>
      <Route exact path="/auth/signup">
        <SignUp />
      </Route>
      <Route exact path="/dashboard">
        <Dashboard />
      </Route>
      <Route path="*" component={NotFound} />
    </Switch>
  </BrowserRouter>
)
