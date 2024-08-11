import { json } from "react-router-dom";

/**
 * @typedef {import('react-router-dom').ActionFunction} ActionFunction
 * @type {ActionFunction}
 */
const authAction = async ({ request }) => {
  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");

  const response = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const { message, status, code } = await response.json();
    return json({ message, status, code });
  } else return response;
};

export default authAction;
