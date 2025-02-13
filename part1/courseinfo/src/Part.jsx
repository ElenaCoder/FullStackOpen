const Part = (props) => {
  const { part, exercises } = props;

  return (
    <p>{part} {exercises}</p>
  )
}

export default Part;
