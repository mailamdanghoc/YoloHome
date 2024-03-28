import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header";

const Layout = () => {
  return (
    <>
      <Header/>
      <div className="h-[90%] w-full">
        <Navbar/>
        <Outlet/>
      </div>
    </>
  );
};

export default Layout;
