import useToken from "@/store";
import { Navigate, Outlet } from "react-router-dom";
const AuthLayout = () => {
  const token = useToken((state) => state.token);
  console.log(token)
  if (token) {
    return <Navigate to={"/dashboard/home"} replace />;
  }
  return (
    <>
      <Outlet />
    </>
  );
};
export default AuthLayout;
