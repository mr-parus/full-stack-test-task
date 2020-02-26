import { SnackbarProvider } from 'notistack';
import React, { Component } from 'react';
import { notifierConfig } from '../../config';

import Main from '../Main/Main';

export default class App extends Component {
  render() {
    return (
      <SnackbarProvider {...notifierConfig.provider}>
        <Main/>
      </SnackbarProvider>
    );
  }
}
