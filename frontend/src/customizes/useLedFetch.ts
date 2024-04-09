import axios from "axios";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

const ledOnUrl: string = "http://localhost:3001/api/v1/led/turnon";
const ledOffUrl: string = "http://localhost:3001/api/v1/led/turnoff";
const ledNewest: string = "http://localhost:3001/api/v1/led/newest";

// default refresh interval for useSWR to revalidate the data (resend request to backend)
const defaultRefreshInterval: number = 1000;    //1 second

const useLedFetch = () => {
    const lightButtonFetcher = async (url: string): Promise<any> => {
        const res = await axios.get(url);
        return res.data.data;
    };

    const {data, mutate, isValidating} = useSWR(ledNewest, lightButtonFetcher,
        {
            keepPreviousData: true,
            refreshInterval: defaultRefreshInterval
        }
    );

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

export {useLedFetch};