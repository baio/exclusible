import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'apps/client-app/app/store';
import { filter, map, mergeMap, Observable, Subject, take, tap } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

import { ConfigState, SpreadConfig } from './configModels';
import { getSpreadConfig } from './configService';

export const loadConfig = createAction('config/loadConfig');

export const configEpic$ = (action$: Observable<any>): Observable<any> =>
  action$.pipe(
    filter(loadConfig.match),
    mergeMap(() => getSpreadConfig()),
    map((result) => {
      if (result.kind === 'ok') {
        return result.value;
      } else {
        // TODO : Error handling
        return initialState.spread;
      }
    }),
    map(configSlice.actions.spreadConfigLoaded)
  );

const initialState: ConfigState = { spread: { buyOffset: 0, sellOffset: 0 } };

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    spreadConfigLoaded: (state, action: PayloadAction<SpreadConfig>) => {
      return { ...state, spread: action.payload };
    },
  },
});

export const selectConfig = (state: RootState) => state.config;

export default configSlice.reducer;
