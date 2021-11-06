import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from "./store/store";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from "./store/store";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <React.StrictMode>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>        
                <App />      
            </PersistGate>   
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
