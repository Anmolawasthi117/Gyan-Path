import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
   import { calculateRoute } from '../../services/api';

   export const calculateRoute = createAsyncThunk('route/calculateRoute', async ({ startNodeId, endNodeId }) => {
     const { data } = await calculateRoute({ startNodeId, endNodeId });
     return data.data; // Extract route from ApiResponse
   });

   const routeSlice = createSlice({
     name: 'route',
     initialState: {
       route: [],
       currentStep: 0,
       userPosition: null,
       isNavigating: false,
       status: 'idle',
       error: null,
     },
     reducers: {
       setUserPosition: (state, action) => {
         state.userPosition = action.payload;
       },
       nextStep: (state) => {
         state.currentStep += 1;
       },
       exitNavigation: (state) => {
         state.isNavigating = false;
         state.currentStep = 0;
         state.userPosition = null;
         state.route = [];
       },
       startNavigation: (state) => {
         state.isNavigating = true;
       },
     },
     extraReducers: (builder) => {
       builder
         .addCase(calculateRoute.pending, (state) => {
           state.status = 'loading';
         })
         .addCase(calculateRoute.fulfilled, (state, action) => {
           state.status = 'succeeded';
           state.route = action.payload;
         })
         .addCase(calculateRoute.rejected, (state, action) => {
           state.status = 'failed';
           state.error = action.error.message;
         });
     },
   });

   export const { setUserPosition, nextStep, exitNavigation, startNavigation } = routeSlice.actions;
   export default routeSlice.reducer;