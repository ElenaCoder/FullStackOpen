import StatisticsLine from './StatisticsLine';

const Statistics = ({ good, neutral, bad }) => {
    const total = good + neutral + bad;

    if (total === 0) {
        return (
            <div>
                <i>No feedback given</i>
            </div>
        );
    }

    const average = (good - bad) / total;
    const positive = (good / total) * 100;

    return (
        <div>
            <h2>statistics</h2>
            <table>
                <tbody>
                    <StatisticsLine text='Good' value={good} />
                    <StatisticsLine text='Neutral' value={neutral} />
                    <StatisticsLine text='Bad' value={bad} />
                    <StatisticsLine text='All' value={total} />
                    <StatisticsLine text='Average' value={average} />
                    <StatisticsLine text='Positive' value={`${positive} %`} />
                </tbody>
            </table>
        </div>
    );
};

export default Statistics;
