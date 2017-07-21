
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, IndexRoute, useRouterHistory} from 'react-router';
import { createHistory } from 'history';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Main from './app/Main';
import Home from './app/Home';
import Sobre from './app/Sobre';
import Contato from './app/Contato';
import Produtos from './app/Produtos';
import Cardapio from './app/Cardapio';
import Fetch from './util/Fetch';
import store from './store';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

window.App = {
    basePath: window.document.head.dataset.basepath || "",
    fetch: Fetch,
    entities: [],
    entity: {},
    user: {}
};

const browserHistory = useRouterHistory(createHistory)({
    basename: window.App.basePath
});

render((
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path='/' component={Main}>
                <IndexRoute component={Home} />
                <Route path='sobre' component={Sobre} />
                <Route path='contato' component={Contato} />
                <Route path='produtos' component={Produtos} />
                <Route path='cardapio' component={Cardapio} />
            </Route>
        </Router>
    </Provider>
    ),
    document.getElementById('app')
);
