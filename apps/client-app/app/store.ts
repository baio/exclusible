import { configureStore } from '@reduxjs/toolkit';

import rateReducer from '../features/rate/rateSlice';

export const store = configureStore({
  reducer: {
    rate: rateReducer,
  },
  middleware: [],
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
