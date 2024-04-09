import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header";
import { ReactNode, useState, useEffect, createContext } from "react";
import useCheckMobile from "../customizes/useCheckMobile";
import { titleContext } from "../customizes/context";

const Layout = (): ReactNode => {
  const [isNavbarOpen, setNavbarOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("Home");
  const isMobile: boolean = useCheckMobile();


  const handleNavbar = (): void => {
    if (isMobile) setNavbarOpen(!isNavbarOpen);
  }

  const handleSetTitle = (newTitle: string): void => {
    console.log(">>> set new title: ", newTitle);
    setTitle(newTitle);
  }



  return (
    <>
      <titleContext.Provider value={title}>
        <Header isMobile={isMobile} handleNavbar={handleNavbar}/>
      </titleContext.Provider>
      <div className={`h-[90%] w-full ${isMobile ? "" : "flex"}`}>
        <Navbar isNavbarOpen={isMobile ? isNavbarOpen : true} 
        handleNavbar={handleNavbar} setTitle={handleSetTitle}
        />
        <div className="h-full w-full md:w-5/6">
          <Outlet context={handleSetTitle satisfies ((title: string) => void)}/>
        </div>
      </div>
    </>
  );
};

export default Layout;
