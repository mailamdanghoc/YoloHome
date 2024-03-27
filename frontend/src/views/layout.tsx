import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header";

const Layout = () => {
  return (
    <>
      <Header/>
      <Outlet/>
    </>
  );
};

export default Layout;
