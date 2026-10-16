import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import {loadStaate, saveState} from '../utils/storage';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => {
  const { auth } = store.getState();
  saveState({auth: {..auth,error:null}});
});