import { Rate } from '../features/rate/rateModels';

export interface RatesListProps {
  rates: Rate[];
}

const RatesList = ({ rates }: RatesListProps) => {
  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th>Buy</th>
            <th>Sell</th>
            <th>Date UTC</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((rate, i) => (
            <tr className={i === 0 ? 'is-selected' : null} key={rate.timestamp}>
              <td>{rate.buy}</td>
              <td>{rate.sell}</td>
              <td>{new Date(rate.timestamp).toUTCString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default RatesList;
