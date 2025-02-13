import Part from "./Part"

const Content = (props) => {
    const { parts } = props;

    return (
      <div>
        {parts.map((part, index) => (
            <Part key={index} part={part.name} exercises={part.exercises} />
      ))}
      </div>
    );
  };


export default Content;