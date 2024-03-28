import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header";
import { ReactNode, useState, useEffect } from "react";

import useCheckMobile from "../customizes/useCheckMobile";

const Layout = (): ReactNode => {
  const [isNavbarOpen, setNavbarOpen] = useState<boolean>(false);

  const isMobile: boolean = useCheckMobile();

  const handleNavbar = () => {
    if (isMobile) setNavbarOpen(!isNavbarOpen)
  }



  return (
    <>
      <Header isMobile={isMobile} handleNavbar={handleNavbar} />
      <div className={`h-[90%] w-full ${isMobile ? "" : "flex"}`}>
        <Navbar isNavbarOpen={isMobile ? isNavbarOpen : true} handleNavbar={handleNavbar} />
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
