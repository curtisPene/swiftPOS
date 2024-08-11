import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import authAction from "./actions/authAction";
import ErrorPage from "./pages/ErrorPage";
function App() {
  const router = createBrowserRouter([
    {
      errorElement: <ErrorPage />,
      path: "/",
      element: <LoginPage />,
      action: authAction,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
