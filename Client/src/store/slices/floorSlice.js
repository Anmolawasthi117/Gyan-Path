import { createSlice } from '@reduxjs/toolkit';

const floorSlice = createSlice({
  name: 'floor',
  initialState: {
    currentFloor: 1,
  },
  reducers: {
    setFloor: (state, action) => {
      state.currentFloor = action.payload;
    },
  },
});

export const { setFloor } = floorSlice.actions;
export default floorSlice.reducer;