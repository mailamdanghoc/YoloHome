import { ReactNode, useContext, useEffect } from "react";
import AdminPanel from "../components/user/adminPaned";
import UserPanel from "../components/user/userPanel";
import { useOutletContext } from "react-router-dom";
import { useUserFetch } from "../customizes/useUserFetch";
import { userContext } from "../customizes/context";
import { useAdminFetch } from "../customizes/useAdminFetch";

const User = (): ReactNode => {
    const handleSetTitle = useOutletContext<(title: string) => void>();

    useEffect(() => {
        handleSetTitle("User Profile")
    }, [])
    
    const {userId, token} = useContext(userContext);
    const {data: userData, editTrigger, passwordTrigger, passwordError: pError} = useUserFetch({userId: userId, token: token});
    const {data: adminData, mutate, createTrigger, updateTrigger, deleteTrigger} = useAdminFetch(token)


    return (
        <>
            <UserPanel data={userData} editTrigger={editTrigger} passwordTrigger={passwordTrigger} pError={pError}/>
            {userData ? userData.type == "ADMIN" ? <AdminPanel data={adminData} mutate={mutate} createTrigger={createTrigger} updateTrigger={updateTrigger} deleteTrigger={deleteTrigger}/> : <></> : <></>}
        </>
    )
}

export default User;