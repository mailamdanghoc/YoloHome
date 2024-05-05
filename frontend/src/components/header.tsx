import { ReactElement, useContext} from "react";
import Logo from "./logo";
import { IoMenu, IoClose } from "react-icons/io5";
import { titleContext } from "../customizes/context";
import { Link } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";

interface HeaderProps {
    isMobile: boolean,
    handleNavbar: () => void,
    isNavBarOpen: boolean
}

const Header = (props: HeaderProps): ReactElement => {
    
    const title = useContext(titleContext);
    
    return (
        <>
            <div className="w-full h-[10%] flex justify-between bg-white border-b-2 border-gray-300">
                <div className="w-1/3 h-full flex items-center">  
                    {
                    props.isMobile ? 
                    <div onClick={() => { props.handleNavbar()}}>
                        { props.isNavBarOpen ? <IoClose size={30}/> :  <IoMenu size={30}/>}
                    </div> 
                    : <>
                    <div className="md:w-1/2 h-full flex items-center justify-center">
                        <Logo size={2}/>
                    </div>
                     <div className="mx-6 text-2xl font-semibold text-gray-500">{title}</div>
                     </>
                    }
                </div>
                <div className="w-1/3 flex items-center justify-center">
                    {props.isMobile ? <Logo size={1}/> : null}
                </div>
                <div className="w-1/3 h-full flex items-center justify-end">
                    <Link className="h-fit w-fit cursor-pointer" to="user">
                        <div className="h-12 w-12 ml-3 mr-6 flex justify-center items-center rounded-full bg-white border border-gray-300">
                            <FaUserAlt className="text-gray-500" size={20}/>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    )
};

export default Header;