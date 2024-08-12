import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import loginAction from "./actions/loginAction";
import Dashboard from "./pages/Dashboard";
function App() {
  const router = createBrowserRouter([
    {
      errorElement: <ErrorPage />,
      path: "/",
      element: <LoginPage />,
      action: loginAction,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
