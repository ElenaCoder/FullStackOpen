const Total = (props) => {
  const { parts } = props;

  return (
    <div>Number of exercises {parts.reduce((sum,part) => sum + part.exercises, 0)}</div>
  )
}

export default Total;
