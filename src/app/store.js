import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import eventsReducer from '../features/events/eventsSlice';
import registrationsReducer from '../features/registrations/registrationsSlice';
import { loadState, saveState } from '../utils/storage';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    registrations: registrationsReducer,
  },
  preloadedState: loadState(),
});

// Persist only user-created data (never API data)
store.subscribe(() => {
  const { auth, registrations } = store.getState();
  saveState({ auth: { ...auth, error: null }, registrations });
});