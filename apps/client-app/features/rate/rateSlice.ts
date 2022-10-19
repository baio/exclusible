import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'apps/client-app/app/store';
import { filter, map, mergeMap, Observable, Subject, take, tap } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

import { Rate, RateState, WsEvent } from './rateModels';

export const subscribeExchange = createAction('app/subscribeExchange');

export const rateEpic$ = (action$: Observable<any>) =>
  action$.pipe(
    filter(subscribeExchange.match),
    take(1),
    mergeMap(() => {
      const ws = webSocket<WsEvent>('ws://localhost:3333');
      ws.next({ event: 'subscribe' } as any);
      return ws;
    }),
    filter((evt) => evt.event === 'exchangeRate'),
    map((evt) => evt.data),
    map((data) => {
      return rateSlice.actions.appendRate({
        buy: data[0],
        sell: data[1],
        timestamp: data[2],
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
