import { Form, useActionData } from "react-router-dom";

const LoginPage = () => {
  // Create dummy login for testing
  const data = useActionData();
  console.log(data);
  return (
    <Form method="post">
      <label htmlFor="email">E-mail</label>
      <input type="email" id="email" name="email" />
      <label htmlFor="password">Password</label>
      <input type="password" name="password" id="password" />
      <button type="submit">Login</button>
    </Form>
  );
};

export default LoginPage;
