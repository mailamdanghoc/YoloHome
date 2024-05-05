import axios from "axios";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import {time} from "../utils/time";
import { chartData } from "../components/controlBoard/controlBoardChart";

// Server's route
const ledOnUrl: string = "http://localhost:3001/api/v1/led/turnon";
const ledOffUrl: string = "http://localhost:3001/api/v1/led/turnoff";
const ledNewest: string = "http://localhost:3001/api/v1/led/newest";
const ledUsage: string = "http://localhost:3001/api/v1/led/usage";

// Default refresh interval for button (resend request to backend)
const defaultButtonInterval: number = 1000;    //1 sec
// Default refresh interval for chart
const defaultChartInterval: number = 600000;   //10 mins

// set up utility classes
time.setFormat("yyyy-MM-dd");
time.setMonthFormat("MMM");

/** Custom hook to provide means to get and post led's data to server
 */
const useLedFetch = () => {
    /** Support fetcher for swr
     */
    const ledButtonFetcher = async (url: string): Promise<any> => {
        const res = await axios.get(url);
        return res.data.data;
    };

    /** Hook to get the data
     */
    const {data, mutate, isValidating} = useSWR(ledNewest, ledButtonFetcher,
        {
            keepPreviousData: true,
            refreshInterval: defaultButtonInterval
        }
    );

    /** Hook to post the data
     *  After this hook finish posting, it'll fire a mutate signal to the Hook above to revalidate data for display
     *  Optimistic UI: includes optimistic UI for improved UX. Still not completely solve race condition...
     */
    const {trigger} = useSWRMutation((data?.status ? ledOffUrl : ledOnUrl),
        async (url: string) => {
            await axios.post(url).then(() => {
                const newData = {...data, status: !data.status};
                mutate(newData,
                {   revalidate: false,
                    optimisticData: newData,
                    populateCache: true,
                })
            })
        }
    );
    
    return {data, trigger, isValidating};
}


/** Custon hook to provide means to get led's chart data
 */
const useLedUsageFetch = () => {
    // get time
    const {now, last7Days, lastMonth, lastYear} = time.customGetTime();

    /** Fetcher for swr, using axios to request a GET from url?startDate=<string>endDate=<string>intervalType=<string>
     *  Utils class to format data (fill missing date in array, reformat date, see utils/time.ts)
     */
    const ledFetcher = async (url: string, startDate: string, endDate: string, type: "day" | "month"): Promise<chartData[]> => {
        const res = await axios.get(url,
            {params : {
                startDate: startDate,
                endDate: endDate,
                intervalType: type
            }
        });
        //fill missing data
        const data: chartData [] = time.fillMissingArray(res.data.data, startDate, endDate, type);
        return (type === "day") ? time.reFormat(data, "dd-MM") : data;
    }

    /** Fetcher wrapper for sending multiple requests using above fetcher by mapping urls
     */
    const fetcherWrapper = (key: {url: string, args: {startDate: string, endDate: string, type: "day" | "month"} []}): Promise<chartData[][]> => {
        return Promise.all(
            key.args.map(
                (arg) => ledFetcher(key.url, arg.startDate, arg.endDate, arg.type)
            )
        );
    }

    // list arguments
    const args: {startDate: string, endDate: string, type: "day" | "month"} [] = [
        {startDate: last7Days, endDate: now, type: "day"},
        {startDate: lastMonth, endDate: now, type: "day"},
        {startDate: lastYear, endDate: now, type: "month"}
    ];

    /** Hook to get data
     */
    const { data, isLoading, mutate } = useSWR({url: ledUsage, args: args}, fetcherWrapper, {
        keepPreviousData: true,
        refreshInterval: defaultChartInterval,
    })

    return {data, isLoading};
}

export {useLedFetch, useLedUsageFetch};