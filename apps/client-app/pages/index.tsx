import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import Auth from '../components/Auth';
import ConfigForm from '../components/ConfigForm';
import RatesList from '../components/RatesList';
import { SpreadConfig } from '../features/config/configModels';
import { saveSpreadConfig } from '../features/config/configService';
import { loadConfig, selectConfig } from '../features/config/configSlice';
import { selectRate, subscribeExchange } from '../features/rate/rateSlice';
import { setAxiosTokenInterceptor } from '../features/shared';

let started = false;

let wasAuthenticated = false;

export function Index() {
  const dispatch = useAppDispatch();

  const { isAuthenticated, getAccessTokenSilently } =
    useAuth0();

  useEffect(() => {
    if (!started) {
      dispatch(subscribeExchange());
    }
    started = true;
    if (isAuthenticated && !wasAuthenticated) {
      setAxiosTokenInterceptor(getAccessTokenSilently).then(() =>
        dispatch(loadConfig())
      );
    }
    wasAuthenticated = isAuthenticated;
  });

  const onSet = async (config: SpreadConfig) => saveSpreadConfig(config);

  const rateState = useAppSelector(selectRate);
  const configState = useAppSelector(selectConfig);

  return (
    <>
      <Auth></Auth>
      {isAuthenticated && (
        <ConfigForm config={configState.spread} onSet={onSet}></ConfigForm>
      )}
      <RatesList rates={rateState.rates}></RatesList>
    </>
  );
}

export default Index;
