import { useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { URL_VALIDATE } from '../api/constants';
import { AuthDispatchContext } from '../context/authContext';

export function useInitializeAuth() {
  const dispatch = useContext(AuthDispatchContext)!;

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const response = await axios.post(URL_VALIDATE, null, {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        });

        dispatch(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [dispatch]);
}
