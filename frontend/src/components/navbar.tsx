import { Link } from "react-router-dom";
import { ReactElement, useState } from "react";
import { DiApple } from "react-icons/di";

interface NavbarComponent {
    content: string,
    link: string,
    icon: ReactElement
}

const Navbar = () => {
    const [navbarComponents, setNavbarComponents] = useState<NavbarComponent[]>([
        {
            content: "Home",
            link: "/",
            icon: <DiApple size={50} className="pl-3"/>
        }
    ])

    return (
        <div className="h-full w-1/5 bg-white">
            {
                navbarComponents.map((navbarComponent: NavbarComponent):ReactElement => {
                    return(
                        <div className="h-[10%] w-full flex border-b border-gray-300">
                            <Link className="h-full w-full flex items-center" to={navbarComponent.link}>
                                <div className="h-3/4 w-[5%] my-auto rounded-r-lg bg-blue-500"/>
                                <div className="w-full flex items-center float-right text-2xl text-blue-500">
                                    {navbarComponent.icon}
                                    <span className="w-full">{navbarComponent.content}</span>
                                </div>
                            </Link>
                        </div>
                    )
                })
            }
        </div>
    )
};

export default Navbar;