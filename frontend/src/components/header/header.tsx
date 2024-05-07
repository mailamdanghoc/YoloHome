import { ReactElement, useContext} from "react";
import Logo from "../logo";
import { IoMenu, IoClose } from "react-icons/io5";
import { titleContext } from "../../customizes/context";
import { Link } from "react-router-dom";
import UserAction from "./userAction";

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
                    <div className="mx-3" onClick={() => { props.handleNavbar()}}>
                        { props.isNavBarOpen ? <IoClose size={30}/> :  <IoMenu size={30}/>}
                    </div> 
                    : <>
                    <Link className="md:w-1/2 h-full flex items-center justify-center" to="/">
                        <Logo size={2}/>
                    </Link>
                    
                     <div className="mx-6 text-2xl font-semibold text-gray-500">{title}</div>
                     </>
                    }
                </div>
                <Link className="w-1/3 flex items-center justify-center" to="/">
                    {props.isMobile ? <Logo size={1}/> : null}
                </Link>
                <div className="w-1/3 h-full flex items-center justify-end">
                    <UserAction/>
                </div>
            </div>
        </>
    )
};

export default Header;