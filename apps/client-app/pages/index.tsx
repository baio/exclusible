import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectRate, subscribeExchange } from '../features/rate/rateSlice';
import styles from './index.module.css';
import RatesList from '../components/RatesList';

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
  return <RatesList rates={rateState.rates}></RatesList>;
}

export default Index;
