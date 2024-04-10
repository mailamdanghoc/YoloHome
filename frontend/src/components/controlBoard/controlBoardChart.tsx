import { ReactElement, useRef, useState, memo, useCallback } from "react";
import { useLedUsageFetch } from "../../customizes/useLedFetch";
import { useFanUsageFetch } from "../../customizes/useFanFetch";
import useDimensions from "../../customizes/useDimensions";
import BarChart from "../BarChart";
type chartData = {
    time: string,
    sumValue: number
}

interface props {
    type: "fan" | "led"
}

// wrapping to avoid unnecessary re-render
const ControlBoardChart =  memo((props: props): ReactElement => {
    const containerRef = useRef(null); 
    const size = useDimensions(containerRef);
    const [DataSelector, setDataSelector] = useState<number>(0);
    const {data} = props.type == "led" ? useLedUsageFetch() : useFanUsageFetch();

    //if(!isLoading && data) setDataSelector(data[0]);

    const handleChoiceChange = (event: React.ChangeEvent) => {
        const value = (event.target as HTMLInputElement).value;
        if(data) {
            switch (value) {
                case "Last month":
                    setDataSelector(1)
                    break;
                case "Last year":
                    setDataSelector(2)
                    break;
                default:
                    setDataSelector(0)
                    break;
            }
        }
    };

    return (
        <div className="h-full p-full rounded-xl p-2 block bg-white">
            <select className="w-1/5 md:w-[30%] h-[15%] md:h-[10%] rounded-lg float-right 
            text-center bg-white font-semibold text-gray-500 text-xs md:text-lg hover:bg-sky-100"
            onChange={(event) => {handleChoiceChange(event)}}>
                <option value="Last 7 days">Last 7 days</option>
                <option value="Last month">Last month</option>
                <option value="Last year">Last year</option>
            </select>
            <div className="w-full h-[85%] md:h-[90%] bg-white" ref={containerRef}>
                <BarChart width={size.width} height={size.height} barColor="fill-sky-500" textStyle="text-sm font-semibold text-indigo-800"
                margin={{top: 30, bottom: 30, right: 20, left: 20}} data={data ? data[DataSelector] : []}  
                />
            </div>
        </div>
    )
})

export default ControlBoardChart;
export type {chartData};