import { ReactElement, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Logo from "../components/logo";

const Home = (): ReactElement => {
    const handleSetTitle = useOutletContext<(title: string) => void>();

    useEffect(() => {
        handleSetTitle("Home Page")
    },[]);

    return (
        <div className="h-full w-ful px-10 py-10">
            <div className="h-full w-full bg-white/75">
                <div className=" py-5 px-5 text-3xl ">
                    <span className="font-semibold text-gray-500">Welcome to </span>
                    <Logo size={3}></Logo>
                </div>
                <div className="py-5 px-5">
                    <div className="text-3xl font-semibold text-gray-500 mb-3">
                        Over view
                    </div>
                    <div className="text-xl text-gray-500">
                        Yolo:Home is a smart home service. It manages the conditions of the house environment such as temperature, humidity, lighting, etc. It also allows you to control your household devices like lights and fans.
                    </div>
                </div>
                <Link to="devices" className="px-5 py-5 text-xl text-gray-500 hover:text-gray-800 hover:underline">
                        Let's explore!
                </Link>
            </div>
        </div>
    )
}

export default Home;