const Header = (props) => {
  console.log(props);
  const { name } = props;

  return (
    <h1>{name}</h1>
  )
}

export default Header;