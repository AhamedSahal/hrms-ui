import React from 'react';
import ReactDOM from "react-dom/client"; // ⬅️ Use this instead
import { Provider } from "react-redux";
import Main from "./Entryfile/Main.jsx";
import { applyMiddleware, compose, createStore } from "redux";
import {thunk} from "redux-thunk"; // Fixed import
import reducers from "./reducers";
import { usePromiseTracker } from 'react-promise-tracker';
import { CircularProgress } from "@mui/material";
import { getPrimaryColor } from "./utility";

const composer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composer(applyMiddleware(thunk)));
console.log(store);

const LoadingIndicator = () => {
    const { promiseInProgress } = usePromiseTracker();
    return promiseInProgress && (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,.5)',
            zIndex: 1010,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <CircularProgress style={{ color: getPrimaryColor() }} />
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('app'))

root.render(
    <Provider store={store}>
        
        <Main />
        <LoadingIndicator />
    </Provider>
);
