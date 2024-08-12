import { json, useNavigate } from "react-router-dom";

const useLogout = () => {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      // Send logout request
      const response = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      // Redirect to error page if request fails
      if (!response.ok) {
        throw json(
          { message: "Failed to logout", code: "SERVER_ERROR" },
          { status: 500 }
        );
      }
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return logout;
};

export default useLogout;
