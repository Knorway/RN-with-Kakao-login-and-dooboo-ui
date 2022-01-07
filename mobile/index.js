import React from 'react';
import { AppRegistry } from 'react-native';
import { ThemeProvider } from 'dooboo-ui';

import App from './src/App';
import { name as appName } from './app.json';
import { AuthProvider } from './src/context/authContext';

const Root = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  );
};

AppRegistry.registerComponent(appName, () => Root);
