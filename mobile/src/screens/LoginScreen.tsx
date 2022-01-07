import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Button } from 'dooboo-ui';
import { URL_LOGIN, URL_REGISTER, URL_VALIDATE } from '../api/constants';
import { AuthDispatchContext, UserType } from '../context/authContext';
import {
  getProfile,
  KakaoOAuthToken,
  KakaoProfile,
  login,
  unlink,
} from '@react-native-seoul/kakao-login';

type ScreenCtxType = 'Login' | 'Register';

type InputType = {
  email: string;
  password: string;
  passwordConfirmed?: string;
};

const initialForm = {
  email: '',
  password: '',
  passwordConfirmed: '',
};

const LoginScreen = () => {
  const [screenCtx, setScreenCtx] = useState<ScreenCtxType>('Login');
  const [form, setForm] = useState<InputType>(initialForm);
  const dispatch = useContext(AuthDispatchContext)!;

  const switchScreen = (ctx: ScreenCtxType) => {
    return () => {
      setForm(initialForm);
      setScreenCtx(ctx);
    };
  };

  const onChangeInput = (inputKey: keyof InputType) => (text: string) => {
    setForm((prev) => ({ ...prev, [inputKey]: text }));
  };

  const handleSubmit = async () => {
    const url = screenCtx === 'Login' ? URL_LOGIN : URL_REGISTER;

    try {
      const { data: token } = await axios.post(url, form);
      await AsyncStorage.setItem('token', JSON.stringify(token));

      const { data: user } = await axios.post<UserType>(URL_VALIDATE, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(user);
    } catch (error: any) {
      console.log('handleSubmit', error);
    }
  };

  const kakaoLogin = async () => {
    try {
      const token: KakaoOAuthToken = await login();
      const response = (await getProfile()) as KakaoProfile;
      dispatch({ userId: response.id, email: response.email });
      console.log(response, token);
    } catch (error) {
      console.log(error);
    }
  };

  const unlinkKakao = async () => {
    const response = await unlink();
    console.log(response);
  };

  return (
    <>
      {screenCtx === 'Login' ? (
        <View style={styles.container}>
          <Text style={styles.title}>로그인</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={onChangeInput('email')}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={form.password}
            onChangeText={onChangeInput('password')}
          />
          {/* {error && <Text style={{ color: 'tomato' }}>{error}</Text>} */}
          <Button type="primary" text="로그인" onPress={handleSubmit} />
          <Button
            type="info"
            text="이메일 회원가입"
            onPress={switchScreen('Register')}
          />
          <Button type="warning" text="카카오로 로그인" onPress={kakaoLogin} />
          <Button type="warning" text="unlink" onPress={unlinkKakao} />
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>회원가입</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={onChangeInput('email')}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={form.password}
            onChangeText={onChangeInput('password')}
          />
          <TextInput
            style={styles.input}
            placeholder="confirm your password"
            secureTextEntry={true}
            value={form.passwordConfirmed}
            onChangeText={onChangeInput('passwordConfirmed')}
          />
          {/* {error && <Text style={{ color: 'tomato' }}>{error}</Text>} */}
          <Button type="info" text="회원가입" onPress={handleSubmit} />
          <Button
            type="primary"
            text="돌아가기"
            onPress={switchScreen('Login')}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '50%',
    marginBottom: 3,
    padding: 8,
    borderWidth: 0.5,
    borderColor: '#dee2e6',
    borderRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
});

export default LoginScreen;
