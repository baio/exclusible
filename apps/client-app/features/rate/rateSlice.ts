import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'apps/client-app/app/store';
import { Rate, RateState } from './rateModels';

const initialState: RateState = { rates: [] };

export const rateSlice = createSlice({
  name: 'rate',
  initialState,
  reducers: {
    append: (state, action: PayloadAction<Rate[]>) => {
      return state;
    },
  },
});

export const selectRate = (state: RootState) => state.rate;

export default rateSlice.reducer;

export const { append } = rateSlice.actions;

