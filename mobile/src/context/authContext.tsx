import React, { createContext, Dispatch, Reducer, useReducer } from 'react';

export type UserType = {
  userId: string;
  email: string;
} | null;

type AuthProvider = {
  children: React.ReactNode;
};

const initialState: UserType = null;

const reducer: Reducer<UserType, UserType> = (state, newState) => newState;

export const AuthStateContext = createContext<UserType>(null);
export const AuthDispatchContext = createContext<Dispatch<UserType> | null>(
  null,
);

export function AuthProvider({ children }: AuthProvider) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}
