
import { createStore, combineReducers } from 'redux';

const initialNotifyState = {
    msg: ""
};

const notifyReducer = function(state = initialNotifyState, action) {
    switch(action.type) {
        case 'NOTIFY':
            return Object.assign({}, state, action.data);
    }
    return state;
};

const initialMessageState = {
    open: false,
    title: '',
    content: null,
    confirm: null
};

const messageReducer = function(state = initialMessageState, action) {
    switch(action.type) {
        case 'MESSAGE':
            return Object.assign({}, state, action.data);
    }
    return state;
};

const rootReducer = combineReducers({
    notify: notifyReducer,
    message: messageReducer
});
const store = createStore(rootReducer);

export default store;
