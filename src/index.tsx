import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Menu from "./Menu";
import {HashRouter, Route, Routes} from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <HashRouter>
          <Routes>
              <Route path="/" element={<Menu/>}/>
              <Route path="/game" element={<App/>}/>
          </Routes>

      </HashRouter>
  </React.StrictMode>
);
