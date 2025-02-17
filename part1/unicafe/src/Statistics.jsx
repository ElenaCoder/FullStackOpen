import StatisticsLine from './StatisticsLine';

const Statistics = ({ good, neutral, bad }) => {
    const total = good + neutral + bad;

    if (total === 0) {
      return <div><i>No feedback given</i></div>;
    }

    const average = (good - bad) / total;
    const positive = (good / total) * 100;

    return (
      <div>
        <h2>statistics</h2>
        <StatisticsLine text="good" value ={good} />
        <StatisticsLine text="neutral" value ={neutral} />
        <StatisticsLine text="bad" value ={bad} />

        <StatisticsLine text="all" value ={total} />
        <StatisticsLine text="average" value ={average} />
        <StatisticsLine text="positive" value ={`${positive} %`} />

      </div>
    );
  };

export default Statistics;