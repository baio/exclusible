import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectRate, subscribeExchange } from '../features/rate/rateSlice';
import styles from './index.module.css';
import RatesList from '../components/RatesList';
import ConfigForm from '../components/ConfigForm';
import { SpreadConfig } from '../features/config/configModels';
import { loadConfig, selectConfig } from '../features/config/configSlice';

let started = false;

export function Index() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!started) {
      dispatch(subscribeExchange());
      dispatch(loadConfig());
    }
    started = true;
  });

  const onSet = (config: SpreadConfig) => {
    console.log('+++', config);
    return Promise.resolve();
  };

  const rateState = useAppSelector(selectRate);
  const configState = useAppSelector(selectConfig);
  return (
    <>
      <ConfigForm config={configState.spread} onSet={onSet}></ConfigForm>
      <RatesList rates={rateState.rates}></RatesList>
    </>
  );
}

export default Index;
