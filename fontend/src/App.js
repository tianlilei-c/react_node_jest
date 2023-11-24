import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Login from './pages/auth/auth';
import Index from './pages/main/main';
import Updateuser from './pages/profile/profile';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/auth" component={Login} />
          <Route path="/profile" component={Updateuser} />
          <Route exact path="/" component={Index} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
