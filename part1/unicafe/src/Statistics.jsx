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
        <div>good {good}</div>
        <div>neutral {neutral}</div>
        <div>bad {bad}</div>
        <div>all {total}</div>
        <div>average {average}</div>
        <div>positive {positive} %</div>
      </div>
    );
  };

export default Statistics;