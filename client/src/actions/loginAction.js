import { json, redirect } from "react-router-dom";

const loginAction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const response = await fetch("http://localhost:8080/api/auth/login", {
    body: JSON.stringify(data),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  console.log(response);
  if (!response.ok) {
    return response;
  }

  return redirect("/dashboard");
};

export default loginAction;
