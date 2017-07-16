
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, IndexRoute, useRouterHistory} from 'react-router';
import { createHistory } from 'history';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Main from './app/Main';
import Home from './app/Home';
import Teste from './app/teste/Teste';
import ComProspect from './app/teste/Teste';
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
                <Route path='teste' component={Teste} />
            </Route>
        </Router>
    </Provider>
    ),
    document.getElementById('app')
);
