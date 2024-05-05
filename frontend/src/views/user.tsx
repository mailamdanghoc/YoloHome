import { ReactNode, useContext } from "react";
import AdminPanel from "../components/user/adminPaned";
import UserPanel from "../components/user/userPanel";
import { userContext } from "../customizes/context";

const User = (): ReactNode => {
    
    return (
        <>
            <UserPanel />
            <AdminPanel />
        </>
    )
}

export default User;