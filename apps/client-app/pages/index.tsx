import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectRate, subscribeExchange } from '../features/rate/rateSlice';
import styles from './index.module.css';
import RatesList from '../components/RatesList';
import ConfigForm from '../components/ConfigForm';
import { SpreadConfig } from '../features/config/configModels';

let started = false;

export function Index() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!started) {
      dispatch(subscribeExchange());
    }
    started = true;
  });

  const onSet = (config: SpreadConfig) => {
    console.log('+++', config);
    return Promise.resolve();
  };

  const rateState = useAppSelector(selectRate);
  return (
    <>
      <ConfigForm
        config={{ buyOffset: -1, sellOffset: 1 }}
        onSet={onSet}
      ></ConfigForm>
      <RatesList rates={rateState.rates}></RatesList>
    </>
  );
}

export default Index;
