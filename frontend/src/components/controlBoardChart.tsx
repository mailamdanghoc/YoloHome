import { ReactNode, useRef } from "react";
import useCheckMobile from "../customizes/useCheckMobile";
import useDimensions from "../customizes/useDimensions";
import BarChart from "./BarChart";

const data = [
    { "name": "1/3/2003", "value": 10 },
    { "name": "2/3/3", "value": 12 },
    { "name": "03/03", "value": 15 },
    { "name": "4/3/3", "value": 19 },
    { "name": "5/3/3", "value": 24 },
    { "name": "6/3/3", "value": 13 },
    { "name": "7/3/3", "value": 8 },
]

const ControlBoardChart = () => {
    const containerRef = useRef(null);
    const size = useDimensions(containerRef);
    const isMobile = useCheckMobile();

    return (
        <div className="h-full p-full rounded-xl bg-white block md:flex">
            <div className="w-full  md:w-[90%] h-4/5 md:h-full bg-white" ref={containerRef}>
                <BarChart width={size.width} height={size.height} barColor="fill-sky-500" textStyle="text-sm font-semibold text-indigo-800"
                margin={{top: 30, bottom: 30, right: 20, left: 20}} data={data}  
                />
            </div>
            <div className="w-full md:w-[10%] h-1/5 md:h-full bg-gray-500"></div>
        </div>
    )
}

export default ControlBoardChart;