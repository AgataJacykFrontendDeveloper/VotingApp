import "./Alert.css";

const Alert = ({ msg, type }) => {
  return (
    <div
      className={`alert alert-${type} w-fit text-center mx-auto`}
      role="alert"
    >
      {msg}
    </div>
  );
};

export default Alert;
