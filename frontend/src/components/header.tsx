import { ReactElement, useContext} from "react";
import Logo from "./logo";
import { titleContext } from "../customizes/context";
import { Link } from "react-router-dom";

interface HeaderProps {
    isMobile: boolean,
    handleNavbar: () => void
}

const Header = (props: HeaderProps): ReactElement => {
    const title = useContext(titleContext);
    
    return (
        <>
            <div className="w-full h-[10%] flex justify-between bg-white border-b-2 border-gray-300">
                <div className="w-1/3 h-full flex items-center">  
                    {
                    props.isMobile ? 
                    <div onClick={() => { props.handleNavbar()}}>Open</div> 
                    : <div className="md:w-1/2 h-full flex items-center justify-center">
                        <Logo size={2}/>
                    </div>
                    }
                    <div className="mx-6">{title}</div>
                </div>
                <div className="w-1/3"></div>
                <div className="w-1/3 h-full flex items-center justify-end">
                    <Link className="h-fit w-fit cursor-pointer" to="user">
                        <div className="h-12 w-12 ml-3 mr-6 rounded-full bg-black"></div>
                    </Link>
                </div>
            </div>
        </>
    )
};

export default Header;