const Total = (props) => {
    const { parts } = props;

    return (
        <div>
            <b>
                total of {parts.reduce((sum, part) => sum + part.exercises, 0)}{' '}
                exercises
            </b>
        </div>
    );
};

export default Total;
