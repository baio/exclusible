import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectRate, subscribeExchange } from '../features/rate/rateSlice';
import styles from './index.module.css';

let started = false;

export function Index() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!started) {
      dispatch(subscribeExchange());
    }
    started = true;
  });

  const rateState = useAppSelector(selectRate);
  return (
    <ul>
      Latest rates
      <li>buy | sell | time (UTC) </li>
      {rateState.rates.map((rate) => (
        <li key={rate.timestamp}>
          {rate.buy} | {rate.sell} | {new Date(rate.timestamp).toUTCString()}
        </li>
      ))}
    </ul>
  );
}

export default Index;
