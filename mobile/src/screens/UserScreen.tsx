import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthDispatchContext, AuthStateContext } from '../context/authContext';

const UserScreen = () => {
  const user = useContext(AuthStateContext);
  const dispatch = useContext(AuthDispatchContext)!;

  const handleLogOut = async () => {
    try {
      await AsyncStorage.multiRemove(['token']);
      dispatch(null);
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Info</Text>
      <Text>Email: {user.email}</Text>
      <Text>userId: {user.userId}</Text>
      <TouchableOpacity onPress={handleLogOut}>
        <Text style={styles.logout}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  logout: {
    color: 'tomato',
    marginTop: 6,
  },
});

export default UserScreen;
