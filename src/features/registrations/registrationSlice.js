import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  byUser: {}, // { [userId]: [registration, registration, ...] }
};

const registrationsSlice = createSlice({
  name: 'registrations',
  initialState,
  reducers: {
    registerForEvent(state, action) {
      const { userId, registration } = action.payload;
      const list = state.byUser[userId] ?? [];
      const alreadyRegistered = list.some((r) => r.eventId === registration.eventId);
      if (alreadyRegistered) return; // duplicate prevention
      state.byUser[userId] = [...list, registration];
    },
    cancelRegistration(state, action) {
      const { userId, eventId } = action.payload;
      const list = state.byUser[userId] ?? [];
      state.byUser[userId] = list.filter((r) => r.eventId !== eventId);
    },
  },
});

export const { registerForEvent, cancelRegistration } = registrationsSlice.actions;
export default registrationsSlice.reducer;

// ---- Selectors ----
const EMPTY = [];

export const selectMyRegistrations = (state) => {
  const userId = state.auth.currentUser?.id;
  if (!userId) return EMPTY;
  return state.registrations.byUser[userId] ?? EMPTY;
};

export const selectIsRegistered = (eventId) => (state) =>
  selectMyRegistrations(state).some((r) => r.eventId === eventId);