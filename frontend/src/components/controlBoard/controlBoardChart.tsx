import { ReactElement, useRef, useState, memo } from "react";
import { useLedUsageFetch } from "../../customizes/useLedFetch";
import useDimensions from "../../customizes/useDimensions";
import BarChart from "../BarChart";

const data1 = [
    { "name": "1/3/2003", "value": 10 },
    { "name": "2/3/3", "value": 12 },
    { "name": "03/03", "value": 15 },
    { "name": "4/3/3", "value": 19 },
    { "name": "5/3/3", "value": 24 },
    { "name": "6/3/3", "value": 13 },
    { "name": "7/3/3", "value": 8 },
]

const data2 = [
    {"name": "Jan", "value": 100},
    {"name": "Jan2", "value": 1240},
    {"name": "Jan3", "value": 150},
    {"name": "Jan4", "value": 160},
    {"name": "Jan5", "value": 130},
    {"name": "Jan6", "value": 50},
    {"name": "Jan7", "value": 300},
    {"name": "Jan8", "value": 400},
] 

const data3 = [{"name": "type1" , "value" : 100}] ;
for (let i = 0 ; i < 29; i++) data3.push({"name" : ("rando").concat(i.toString()), "value":  i})

interface data  {
    name: string,
    value: number
} [];

// wrapping to avoid unnecessary re-render
const ControlBoardChart =  memo((): ReactElement => {
    const containerRef = useRef(null); 
    const size = useDimensions(containerRef);
    const [DataSelector, setDataSelector] = useState<data []>(data1);
    console.log("render control board chart");

    const {data} = useLedUsageFetch();


    const handleChoiceChange = (event: React.ChangeEvent) => {
        const value = (event.target as HTMLInputElement).value;
        switch (value) {
            case "Last month":
                setDataSelector(data2)
                break;
            case "Last year":
                setDataSelector(data3)
                break;
            default:
                setDataSelector(data1)
                break;
        }
    }

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
                margin={{top: 30, bottom: 30, right: 20, left: 20}} data={DataSelector}  
                />
            </div>
        </div>
    )
})

export default ControlBoardChart;