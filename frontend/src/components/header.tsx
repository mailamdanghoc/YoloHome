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
                    props.isMobile ? <span onClick={() => { props.handleNavbar() }}>Open</span> : <Navbar />
                }
            </div>
        </>
    )
};

function Navbar() {
    return (
        <>
            <button className="text-2xl text-cyan-600 mr-20">YOLOHOME</button>

            <div className="">
                <div className="">
                    <span className="text-lg mr-40 text-black">Environment</span>
                    <input type="text" placeholder="Search..."  className="border rounded-lg p-1.5"/>
                </div>

            </div>
        </>
    )
}

export default Header;