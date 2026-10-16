import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {tmFetch} from '../../api/ticketmaster';

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (filters ={}) => {
    const data = await tmFetch('/events.json',{
        countryCode: 'US',
        size: 20,
        sort: 'date,asc',
        ...filters,
    });
    return{
        list: data._embedded?.events ?? [],
        page: data.page,
    };
 });

 export const fetchEventById = createAsyncThunk(
    'events/fetchEventById',
    async (id) => {
        return await tmFetch(`/events/${id}.json`);
    });

export const fetchCategories = createAsyncThunk(
    'events/fetchCategories',
    async () => { 
        const data = await tmFetch('/classifications.json',{size:50});
        const classifications = data._embedded?.classifications ?? [];

        return classifications
            .map((c) => c.segment?.name)
            .filter((name) => name && name !== 'Undefined');
});

// ---- Slice ----

const initialState = {
    list: [],
    page: null,
    status: 'idle',
    error: null,
    selected:null,
    selectedStatus: 'idle',
    selectedError: null,
    categories: [],
};

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        clearSelected(state){
            state.selected = null;
            state.selectedStatus = 'idle';
            state.selectedError = null;
        },
    },

    extraReducers: (builder) => {
        builder
         //list of events
        .addCase(fetchEvents.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(fetchEvents.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.list = action.payload.list;
            state.page = action.payload.page;
        })
        .addCase(fetchEvents.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
        //single event
        .addCase(fetchEventById.pending, (state) => {   
            state.selectedStatus = 'loading';
            state.selectedError = null;
        })
        .addCase(fetchEventById.fulfilled, (state, action) => {
            state.selectedStatus = 'succeeded';
            state.selected = action.payload;
        })
        .addCase(fetchEventById.rejected, (state, action) => {
            state.selectedStatus = 'failed';
            state.selectedError = action.error.message;
        })
        //categories
        .addCase(fetchCategories.pending, (state) => {
            state.categories = action.payload;
        })
        .addCase(fetchCategories.fulfilled, (state, action) => {
            state.categories = action.payload;
        });
    },
});
    
export const { clearSelected } = eventsSlice.actions;
export default eventsSlice.reducer;