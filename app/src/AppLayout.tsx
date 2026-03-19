import { Outlet } from "react-router";
import NavBar from "./components/NavBar/NavBar";

export const AppLayout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};
