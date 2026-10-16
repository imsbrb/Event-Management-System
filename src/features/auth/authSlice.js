import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    users:[],
    currentUser: null,
    error: null,
};

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        registerUser: (state, action) => {
            const { name, email, password } = action.payload;
            const exists = state.users.some((u) => u.email === email);
            if (exists) {
                state.error = 'An account with this email already exists.';
                return;
            }
            const newUser = { id: crypto.randomUUID(), name, email, password };
            state.users.push(newUser);
            state.currentUser = {id: newUser.id,name,email};
            state.error = null;
        },
        login(state,action){
            const { email, password } = action.payload;
            const user = state.users.find((u) => u.email === email && u.password === password);
            if(!user){
                state.error = 'Invalid email or password.';
                return;
            }
            state.currentUser = {id: user.id,name:user.name,email};
            state.error = null;
        },
        logout(state){
            state.currentUser = null;
        },
        clearAuthError(state){
            state.error = null;
        },
    },
});

export const { registerUser, login, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;