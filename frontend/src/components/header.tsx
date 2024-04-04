import { ReactNode } from "react";

interface HeaderProps {
    isMobile: boolean,
    handleNavbar: () => void
    title: string
}

const Header = (props: HeaderProps): ReactNode => {

    return (
        <>
            <div className="w-full h-[10%] flex items-center bg-white border-b-2 border-gray-300">
                {
                    props.isMobile ? 
                    <span onClick={() => { props.handleNavbar()}}>Open</span> 
                    : <div className="md:w-1/6 h-full">Logo</div>
                }
                <div>{props.title}</div>
            </div>
        </>
    )
};

export default Header;