const Statistics = ({ good, neutral, bad }) => {
    if (good === 0 && neutral === 0 && bad === 0) {
        return <div>No feedback given</div>;
    }

    return (
        <div>
            <h2>statistics</h2>
            <div>good {good}</div>
            <div>neutral {neutral}</div>
            <div>bad {bad}</div>
        </div>
    );
};

export default Statistics;