import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header";
import { ReactNode, useState, useEffect, useRef } from "react";

import useCheckMobile from "../customizes/useCheckMobile";

const Layout = (): ReactNode => {
  const [isNavbarOpen, setNavbarOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("Home");
  const isMobile: boolean = useCheckMobile();

  const HeaderRef = useRef(null);

  const handleNavbar = (): void => {
    if (isMobile) setNavbarOpen(!isNavbarOpen);
  }



  return (
    <>
      <Header isMobile={isMobile} handleNavbar={handleNavbar} title={title}/>
      <div className={`h-[90%] w-full ${isMobile ? "" : "flex"}`}>
        <Navbar isNavbarOpen={isMobile ? isNavbarOpen : true} handleNavbar={handleNavbar}/>
        <Outlet/>
      </div>
    </>
  );
};

export default Layout;
