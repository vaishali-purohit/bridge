import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import ThemeSelector from './app/ThemeSelector';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={ store }>
      <ThemeSelector />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
