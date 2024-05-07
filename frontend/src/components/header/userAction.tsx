import {ReactElement, useCallback} from "react";
import { FaUserAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const UserAction = (): ReactElement => {
    const navigate = useNavigate();
    const handleLogOut = useCallback(() => {
        localStorage.setItem("token", "");
        localStorage.setItem("userId", "");
        navigate("signin")
    }, [])

    return (
        <div className="w-fit relative group">
            <Link className="h-fit w-fit cursor-pointer" to="user">
                <div className="h-12 w-12 ml-3 mr-6 flex justify-center items-center rounded-full bg-white border border-gray-300">
                    <FaUserAlt className="text-gray-500" size={20}/>
                </div>
            </Link>
            <div className="absolute left-full -translate-x-full group-hover:flex h-52 w-40 z-90 hidden py-1 bg-white border-gray-300 border
            flex-col justify-between">
                <Link className="w-full h-1/4" to="user">
                    <div className="w-full h-full border-b border-gray-300 hover:outline-none hover:border-gray-500 hover:font-semibold flex items-center px-3">
                        Manage Profile
                    </div>
                </Link>
                <div className="w-full h-fit">
                    <button className="w-1/2 mx-2 my-2 float-right rounded inset-x-1/2 bg-gray-300 text-gray-500 font-semibold"
                    onClick={() => handleLogOut()}>
                        Log out
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UserAction;