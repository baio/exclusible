import { useAppSelector } from '../app/hooks';
import { selectRate } from '../features/rate/rateSlice';
import styles from './index.module.css';

export function Index() {
  const rateState = useAppSelector(selectRate);
  return (
    <ul>
      Latest rates
      {rateState.rates.map((rate) => (
        <li key={rate.timestamp}>
          {rate.buy} | {rate.sell}
        </li>
      ))}
    </ul>
  );
}

export default Index;
