import "./Button.scss";

const Button = ({ title, ...rest }) => {
  return (
    <button type="submit" className="btn" {...rest}>
      {title}
    </button>
  );
};

export default Button;
