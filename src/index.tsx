import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Menu from "./Menu";
import {HashRouter, Route, Routes} from "react-router-dom";
import store from './redux/store'
import {Provider} from 'react-redux';
import Game from './components/Game';


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Menu/>}/>
                    <Route path="/dashboard" element={<App/>}/>
                    <Route path="/game" element={<Game/>}/>
                </Routes>
            </HashRouter>
        </Provider>
    </React.StrictMode>
);
