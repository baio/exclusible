import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'apps/client-app/app/store';
import { filter, map } from 'rxjs';
import { Rate, RateState } from './rateModels';

export const subscribeExchange = createAction('app/subscribeExchange');

export const rateEpic$ = (action$) =>
  action$.pipe(
    filter(subscribeExchange.match),
    map(() => {
      return rateSlice.actions.appendRate({
        timestamp: 1,
        buy: 100,
        sell: 100,
      });
    })
  );

const initialState: RateState = { rates: [] };

export const rateSlice = createSlice({
  name: 'rate',
  initialState,
  reducers: {
    appendRate: (state, action: PayloadAction<Rate>) => {
      return { rates: [action.payload, ...state.rates].slice(0, 5) };
    },
  },
});

export const selectRate = (state: RootState) => state.rate;

export default rateSlice.reducer;
