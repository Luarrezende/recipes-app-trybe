import { Route, Switch } from 'react-router-dom';
import Login from '../pages/Login';
import Meals from '../pages/Meals';
import Drinks from '../pages/Drinks';

function Router() {
  return (
    <Switch>
      <Route exact path="/" component={ Login } />
      <Route path="/meals" component={ Meals } />
      <Route path="/drinks" component={ Drinks } />
    </Switch>
  );
}

export default Router;
