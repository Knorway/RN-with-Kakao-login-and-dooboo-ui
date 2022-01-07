import { Platform } from 'react-native';

export const URL_BASE =
  Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';
export const URL_LOGIN = `${URL_BASE}/auth/login`;
export const URL_REGISTER = `${URL_BASE}/auth/register`;
export const URL_VALIDATE = `${URL_BASE}/auth/validate`;
