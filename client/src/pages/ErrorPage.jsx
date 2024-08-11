import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div>
      <h1>{error.data.code}</h1>
      <p>{error.data.message}</p>
      <p>{error.status}</p>
    </div>
  );
};

export default ErrorPage;
