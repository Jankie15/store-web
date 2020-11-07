import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Importe de todos los componetes de la aplicación
import Home from './componets/home/home';
import Login from './componets/login/login';
import OrderAdmin from './componets/orderAdmin/OrderAdmin';
import Register from './componets/register/Register';
import UserOrder from './componets/userOrders/UserOrder';

// Declaro todas las rutas necesarias de la aplicación
const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/registrar" component={Register} />
        <Route exact path="/admin" component={OrderAdmin} />
        <Route exact path="/orders" component={UserOrder} />
      </Switch>
    </Router>
  );
}

export default App;