import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Header from "../components/header";

const Layout = () => {
  return (
    <>
      <Header/>
      <Outlet/>
      <h1>Edit views/App.tsx to begin!</h1>
    </>
  );
};

export default Layout;
