import React, { useContext } from 'react';
import { AuthStateContext } from './context/authContext';
import { useInitializeAuth } from './hooks/useInitializeAuth';
import LoginScreen from './screens/LoginScreen';
import UserScreen from './screens/UserScreen';

const App: React.FC = () => {
  useInitializeAuth();

  const user = useContext(AuthStateContext);

  return <>{user ? <UserScreen /> : <LoginScreen />}</>;
};

export default App;
