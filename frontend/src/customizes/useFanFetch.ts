import axios from "axios";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import {time} from "../utils/time";
import { chartData } from "../components/controlBoard/controlBoardChart";

// Server's routes
const fanSpeed = "http://localhost:3001/api/v1/fan/control";
const fanNewest = "http://localhost:3001/api/v1/fan/newest"; 
const fanUsage = "http://localhost:3001/api/v1/fan/usage";

// default refresh interval for slider (resend request to backend)
const defaultSliderInterval: number = 1000;    //1 sec
// default refresh interval for chart
const defaultChartInterval: number = 600000;    //10 mins

// set up utility classes
time.setFormat("yyyy-MM-dd");
time.setMonthFormat("MMM");

/** Custom hook to provide means to get and post fan's data to server
 *  Return: 
 *  - data: a State that's the data returned by swr (in this case, led's status), revalidating (or updating) every defaultButtonInterval
 *  - trigger: a function - manual way to send POST request to the server (as this should be done manually); aditional params: speed: number
 *  - isValidating: a State to know if data is in updating phase
 */
const useFanFetch = () => {
    // support fetcher for swr
    const fetcher = async (url: string) => {
        const res = await axios.get(url);
        return res.data.data;
    }

    /** Hook to get data 
     */
    const {data, mutate, isValidating, isLoading} = useSWR(fanNewest, fetcher,
        {
            keepPreviousData: true,
            refreshInterval: defaultSliderInterval
        }
    );

    /** Hook to post the data
     *  After this hook finish posting, it'll fire a mutate signal to the Hook above to revalidate data for display
     *  Optimistic UI: includes optimistic UI for improved UX. Still not completely solve race condition...
     * 
     */
    const { trigger } = useSWRMutation(fanSpeed, async (url: string, { arg } : { arg: {speed: string}}) => {
        await axios.post(url, {speed: arg.speed}).then(() => {
            const newData = {...data, speed: Number(arg.speed)};
            // call mutate
            mutate(newData, {
                optimisticData: newData,
                revalidate: false,
                populateCache: true,
            }).then();
        })
    });

    return {data, trigger, isValidating, isLoading};
};

/** Custon hook to provide means to get fan's chart data
 *  * Return:
 *  - data: a State, [] of chart data, sorted by last 7 days, last month and last year
 */
const useFanUsageFetch = () => {
    // get time
    const {now, last7Days, lastMonth, lastYear} = time.customGetTime();

    /** Fetcher to get data from backend, using axios to request a GET from url?startDate=<string>endDate=<string>intervalType=<string>
     *  * Params:
     *  - url: string (pass from useSWR)
     *  - startDate: string 
     *  - endDate: string
     *  - type: "day" | "month"
     *  
     *  * Return: {data: any} [];
     *  call a util function
     */
    const fanFetcher = async (url: string, startDate: string, endDate: string, type: "day" | "month"): Promise<chartData[]> => {
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
    
    /** Fetcher wrapper for sending multiple request using above fetcher
     *  * Params:
     *  - key sent by swr { url: string
     *                      args: {startDate, endDate, type} - arguments of the fetcher
     *                      }
     *  * Return: Promise []
     */
    const fetcherWrapper = (key: {url: string, args: {startDate: string, endDate: string, type: "day" | "month"} []}): Promise<chartData[][]> => {
        return Promise.all(
            key.args.map(
                (arg) => fanFetcher(key.url, arg.startDate, arg.endDate, arg.type)
            )
        );
    }

    // list of arguments
    const args: {startDate: string, endDate: string, type: "day" | "month"} [] = [
        {startDate: last7Days, endDate: now, type: "day"},
        {startDate: lastMonth, endDate: now, type: "day"},
        {startDate: lastYear, endDate: now, type: "month"}
    ];

    /** Hook to get data
     */
    const { data, isLoading, mutate } = useSWR({url: fanUsage, args: args}, fetcherWrapper, {
        keepPreviousData: true,
        refreshInterval: defaultChartInterval,
    })

    return {data, isLoading};
}

export {useFanFetch, useFanUsageFetch};