import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import {getDateFormatYMD, customGetTime} from "../utils/time";

// Server's route
const ledOnUrl: string = "http://localhost:3001/api/v1/led/turnon";
const ledOffUrl: string = "http://localhost:3001/api/v1/led/turnoff";
const ledNewest: string = "http://localhost:3001/api/v1/led/newest";
const ledUsage: string = "http://localhost:3001/api/v1/led/usage";

// Default refresh interval for useSWR to revalidate the data (resend request to backend)
const defaultRefreshInterval: number = 1000;    //1 second

// Fetch Data Functions
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

const useLedUsageFetch = () => {
    const time = customGetTime(getDateFormatYMD);

    const ledFetcher = async (url: string, startDate: string, endDate: string) => {
        const res = await axios.get(url, 
            {params:{
                startDate: startDate,
                endDate: endDate
            }
        })
        console.log(res.data.data);
        return 1
    }

    const {data, mutate, isLoading} = useSWR(ledUsage, (url) => ledFetcher(url, time.now, time?.last7Days), 
        {
            keepPreviousData: true,
            refreshInterval: 600000,
            shouldRetryOnError: false
        }
    )

    return {data, mutate, isLoading}
}

export {useLedFetch, useLedUsageFetch};