import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.log(error);

  return (
    <div>
      <h1>{error.data.code}</h1>
      <p>{error.data.message}</p>
      <p>{error.data.status}</p>
    </div>
  );
};

export default ErrorPage;
