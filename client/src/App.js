import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


import Home from './componets/home/home';
import Login from './componets/login/Login';
import Register from './componets/register/Register';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/registrar" component={Register} />
      </Switch>
    </Router>
  );
}

export default App;