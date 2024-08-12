import useLogout from "../hooks/useLogout";

const Dashboard = () => {
  const logout = useLogout();
  return (
    <>
      <h1>Dashboard</h1>
      <button onClick={logout}>Logout</button>
    </>
  );
};

export default Dashboard;
