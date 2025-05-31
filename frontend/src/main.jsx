import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { HashRouter } from 'react-router-dom';
import { MyProvider } from "./context/MyContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <MyProvider>
        <App />
      </MyProvider>
    </HashRouter>
  </React.StrictMode>
);
