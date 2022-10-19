import { Rate } from '../features/rate/rateModels';

export interface RatesListProps {
  rates: Rate[];
}

const RatesList = ({ rates }: RatesListProps) => {
  return (
    <ul>
      Latest rates
      <li>buy | sell | time (UTC) </li>
      {rates.map((rate) => (
        <li key={rate.timestamp}>
          {rate.buy} | {rate.sell} | {new Date(rate.timestamp).toUTCString()}
        </li>
      ))}
    </ul>
  );
};

export default RatesList;
