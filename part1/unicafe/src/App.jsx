import { useState } from 'react';
import Button from './Button';
import Statistics from './Statistics';

const App = () => {

    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);

    const handleSetGood = () => {
        setGood(good + 1);
    };

    const handleSetNeutral = () => {
        setNeutral(neutral + 1);
    };

    const handleSetBad = () => {
        setBad(bad + 1);
    };

    return (
        <div>
            <h2>give feedback</h2>
            <Button onClick={handleSetGood} text={'good'} />
            <Button onClick={handleSetNeutral} text={'neutral'} />
            <Button onClick={handleSetBad} text={'bad'} />
            <Statistics good={good} neutral={neutral} bad={bad} />
        </div>
    );
};

export default App;
