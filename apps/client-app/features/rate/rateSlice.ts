import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import appConfig from '../../config';
import { filter, map, mergeMap, Observable, take } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { RootState } from '../../app/store';
import { retry, RetryConfig, tap } from 'rxjs/operators';

const WS_RETRY_DELAY = 3000;

const retryConfig: RetryConfig = {
  delay: WS_RETRY_DELAY,
};

import { Rate, RateState, WsEvent } from './rateModels';

export const subscribeExchange = createAction('rate/subscribeExchange');

const ITEMS_IN_LIST = 5;

export const rateEpic$ = (action$: Observable<any>) =>
  action$.pipe(
    filter(subscribeExchange.match),
    take(1),
    mergeMap(() => {
      const ws = webSocket<WsEvent>(appConfig.api.wsUrl);
      return ws.pipe(
        retry(retryConfig),
        tap((evt) => {
          if (evt.event === 'open') {
            ws.next({ event: 'subscribe' } as any);
          }
        })
      );
    }),
    filter((evt) => evt.event === 'exchangeRate'),
    map((evt) => evt.data),
    map((data) => {
      return rateSlice.actions.appendRate({
        id: data[0],
        buy: data[1],
        sell: data[2],
        timestamp: data[3],
      });
    })
  );

const initialState: RateState = { rates: [] };

export const rateSlice = createSlice({
  name: 'rate',
  initialState,
  reducers: {
    appendRate: (state, action: PayloadAction<Rate>) => {
      return {
        rates: [action.payload, ...state.rates].slice(0, ITEMS_IN_LIST),
      };
    },
  },
});

export const selectRate = (state: RootState) => state.rate;

export default rateSlice.reducer;
