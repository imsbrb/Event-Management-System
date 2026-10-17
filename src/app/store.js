import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import eventsReducer from '../features/events/eventsSlice';
import { loadState, saveState } from '../utils/storage';

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