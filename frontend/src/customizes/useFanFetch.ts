import axios from "axios";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

const fanSpeed = "http://localhost:3001/api/v1/fan/control"
const fanNewest = "http://localhost:3001/api/v1/fan/newest"; 

// default refresh interval for useSWR to revalidate the data (resend request to backend)
const defaultRefreshInterval: number = 1000;    //1 second

const useFanFetch = () => {
    const fetcher = async (url: string) => {
        const res = await axios.get(url);
        console.log(res.data.data[0]);
        return res.data.data[0];
    }

    const {data, mutate, isValidating} = useSWR(fanNewest, fetcher,
        {
            keepPreviousData: true,
            refreshInterval: defaultRefreshInterval
        }
    );

    const { trigger } = useSWRMutation(fanSpeed, async (url: string, { arg } : { arg: {speed: string}}) => {
        await axios.post(url, {speed: arg.speed}).then(() => {
            const newData = {...data, speed: Number(arg.speed)};
            // call mutate
            mutate(newData, {
                optimisticData: newData,
                revalidate: false,
                populateCache: true,
            }).then(() => console.log(">>> done mutating"));
        })
    });

    return {data, trigger, isValidating};
};

export default useFanFetch;