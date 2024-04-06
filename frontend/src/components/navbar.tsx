import { NavLink } from "react-router-dom";
import { ReactElement, ReactNode, useState } from "react";
import { BsCalendar3Event } from "react-icons/bs";
import { DiApple } from "react-icons/di";

interface NavbarComponent {
    content: string,
    link: string,
    icon: ReactElement
}

interface NavbarProps {
    isNavbarOpen: boolean,
    handleNavbar: () => void
}

const Navbar = (props: NavbarProps): ReactNode => {
    const [navbarComponents, setNavbarComponents] = useState<NavbarComponent[]>([
        {
            content: "My Device",
            link: "/devices",
            icon: <BsCalendar3Event size={25}/>
        },
        {
            content: "Home1",
            link: "/home1",
            icon: <DiApple size={30} />
        }
    ])

    return (
        <div className={`w-full ${props.isNavbarOpen ? "h-40" : "h-0"} md:h-full md:w-1/6 bg-white duration-[0.25s] transition-height ease-in-out`}>
            {
                navbarComponents.map((navbarComponent: NavbarComponent): ReactElement => {
                    return (
                        <div key={navbarComponent.content} className="h-1/4 md:h-[15%] w-full flex border-b border-gray-300">
                            <NavLink className="h-full w-full flex items-center" to={navbarComponent.link} onClick={() => { props.handleNavbar() }}>
                                {({ isActive }): ReactElement => (
                                    <>
                                        <div className="h-0 w-0 md:h-3/4 md:w-[2.5%]">
                                            <div className={`h-full my-auto rounded-r-lg bg-cyan-500 ${isActive ? "w-full" : "w-0"} transition-width duration-[0.25s] ease-in-out`}/>
                                        </div>
                                        <div className={`w-full flex items-center text-2xl md:text-xl lg:text-2xl hover:font-medium  ${props.isNavbarOpen ? `${isActive ? "text-cyan-500" : "text-gray-500"}` : "text-transparent"}`}>
                                            <div className={`w-2/5 md:w-1/4 flex justify-center `}>
                                                {navbarComponent.icon}
                                            </div>
                                            <div className={`w-3/5 md:w-3/4 flex justify-start `}>
                                                {navbarComponent.content}
                                            </div>
                                        </div>
                                    </>
                                )}

                            </NavLink>
                        </div>
                    )
                })
            }
        </div>
    )
};

export default Navbar;