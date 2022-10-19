import { configureStore } from '@reduxjs/toolkit';

import configReducer, { configEpic$ } from '../features/config/configSlice';
import rateReducer, { rateEpic$ } from '../features/rate/rateSlice';

import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { merge } from 'rxjs';

const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    rate: rateReducer,
    config: configReducer,
  },
  middleware: [epicMiddleware],
});

export const rootEpic = combineEpics(rateEpic$, configEpic$);
epicMiddleware.run(rootEpic);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
