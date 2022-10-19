import { configureStore } from '@reduxjs/toolkit';

import rateReducer, { rateEpic$ } from '../features/rate/rateSlice';

import { combineEpics, createEpicMiddleware } from 'redux-observable';

const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    rate: rateReducer,
  },
  middleware: [epicMiddleware],
});

export const rootEpic = combineEpics(rateEpic$);
epicMiddleware.run(rootEpic);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
