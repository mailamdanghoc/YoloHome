import { ReactNode } from "react";

interface HeaderProps {
    isMobile: boolean,
    handleNavbar: VoidFunction
}

const Header = (props: HeaderProps): ReactNode => {

    return (
        <>
            <div className="w-full h-[10%] px-5 flex items-center bg-white border-b-2 border-gray-300">
                {
                    props.isMobile ? <span onClick={() => { props.handleNavbar() }}>Open</span> : <span>a</span>
                }
            </div>
        </>
    )
};

export default Header;