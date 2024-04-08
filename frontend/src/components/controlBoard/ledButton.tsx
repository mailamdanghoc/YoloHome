import { ReactNode} from "react";
import { BsBrightnessHigh, BsBrightnessHighFill } from "react-icons/bs";
import { useLedFetch } from "../../customizes/useLedFetch";

const LedButton = (): ReactNode => {
    const {data, trigger} = useLedFetch();

    return (
        <div className="h-full w-full p-6 rounded-xl bg-white">
            <div className="h-1/4 w-full flex" >
                <div className={`${data?.status  ? "hidden" : "sm:block sm:w-fit hidden"}`}>
                    <BsBrightnessHigh size={35} className={`text-gray-300`}/>
                </div>
                <div className={`${data?.status ? "sm:block sm:w-fit hidden" : "hidden"}`}>
                    <BsBrightnessHighFill size={35} className={`text-yellow-300`} />
                </div>
                <span className="sm:px-5 text-2xl font-bold text-gray-500">Light</span>
            </div>
            <div className="h-3/4 w-full flex items-center justify-center">
                <label className="h-1/2 w-full inline-flex items-center justify-center md:justify-start cursor-pointer">
                    <input type="checkbox" value="" className={`sr-only peer `} 
                    checked={data ? data.status : false}
                    onChange={() => {trigger();}}
                    />
                    <div className="relative w-full h-full md:w-3/4 lg:w-3/5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[95%] after:w-[49%] after:transition-all peer-checked:bg-green-600">
                    </div>
                </label>
            </div>
        </div>
    );
}

export default LedButton;