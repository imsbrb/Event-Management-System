import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import {loadState, saveState} from '../utils/storage';
import eventsReducer from '../features/events/eventsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => {
  const { auth } = store.getState();
  saveState({ auth: { ...auth, error: null } });
});