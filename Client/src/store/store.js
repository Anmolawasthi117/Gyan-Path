import { configureStore } from '@reduxjs/toolkit';
import nodeReducer from './slices/nodeSlice';
import routeReducer from './slices/routeSlice';
import floorReducer from './slices/floorSlice';

export const store = configureStore({
  reducer: {
    node: nodeReducer,
    route: routeReducer,
    floor: floorReducer,
  },
});