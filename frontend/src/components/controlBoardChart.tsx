import { ReactNode, useRef } from "react";
import useCheckMobile from "../customizes/useCheckMobile";
import useDimensions from "../customizes/useDimensions";
import BarChart from "./BarChart";

const ControlBoardChart = () => {
    const ref = useRef(null);
    const size = useDimensions(ref);
    const isMobile = useCheckMobile();

    return (
        <div className="h-full p-full rounded-xl bg-white block md:flex">
            <div className="w-full  md:w-[90%] h-4/5 md:h-full bg-white" ref={ref}>
                <BarChart width={size.width} height={size.height} />
            </div>
            <div className="w-full md:w-[10%] h-1/5 md:h-full bg-gray-500"></div>
        </div>
    )
}

export default ControlBoardChart;