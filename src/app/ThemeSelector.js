import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import { darkTheme } from '../Theme';
import App from './App';
import { startSaga } from './rootSaga';

// eslint-disable-next-line react/prefer-stateless-function
class ThemeSelector extends React.Component {
  render() {
    return (
      <ThemeProvider theme={ darkTheme }>
        <App />
      </ThemeProvider>
    );
  }
}

export default () => {
  startSaga();
  return <ThemeSelector />
};
