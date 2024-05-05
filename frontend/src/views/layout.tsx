import { Outlet, redirect, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header";
import { ReactNode, useState, useEffect, createContext } from "react";
import useCheckMobile from "../customizes/useCheckMobile";
import { useUserFetch } from "../customizes/useUserFetch";
import { titleContext, userContext } from "../customizes/context";
import axios from "axios";

const Layout = (): ReactNode => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [isNavbarOpen, setNavbarOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("Home");
  const [user, setUser] = useState<{token: string, userId: string}>();
  const isMobile: boolean = useCheckMobile();


  const handleNavbar = (): void => {
    if (isMobile) setNavbarOpen(!isNavbarOpen);
  }

  const handleSetTitle = (newTitle: string): void => {
    console.log(">>> set new title: ", newTitle);
    setTitle(newTitle);
  }

  const navigate = useNavigate();
  // I can only call axios here and not use useSWR because some problem happenning with useEffect that i cant fix 
  // (cannot call hook inside useEffect, order of hook calling messed up, ...)
  // the idea is to request something to test if token expired or not, then redirect

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if(userId === null || token === null) navigate("/signin");
    else {
      axios.get(`http://localhost:3001/api/v1/accounts/${userId}`, {headers: {
        Authorization: "bearer " + token
      }})
      .then(res => {
        setUser({token: token, userId: userId});
      })
      .catch(error => {
        const status = error.response?.status;
        if(!status) //poor network
          navigate("/signin");
        switch (status) {
          case 401: //unauthen meaning token has expired
            navigate("/signin");  
            break;
          default:
            //500 - server's down
            break;
        }
      })
    }
  }, [])

  return (
    <>
      <titleContext.Provider value={title}>
        <Header isMobile={isMobile} handleNavbar={handleNavbar} isNavBarOpen={isNavbarOpen}/>
      </titleContext.Provider>
      <div className={`h-[90%] w-full ${isMobile ? "" : "flex flex-grow"}`}>
        <Navbar isNavbarOpen={isMobile ? isNavbarOpen : true} 
        handleNavbar={handleNavbar} setTitle={handleSetTitle}
        />
        {user ?
        <userContext.Provider value={user}>
          <div className="h-full w-full md:w-5/6">
            <Outlet context={handleSetTitle satisfies ((title: string) => void)}/>
          </div>
        </userContext.Provider>
        : null}
      </div>
    </>
  );
};

export default Layout;
