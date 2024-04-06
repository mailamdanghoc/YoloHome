import { useEffect, useState } from "react";
import axios, { AxiosPromise, AxiosResponse } from "axios";
import useSWR from "swr";

const fetcher = async (url: string): AxiosPromise<any> => {
    return await axios.get(url).then((res: AxiosResponse) => {
        console.log("call GET from " + url);
        return res.data;
    })
} 


const useFetchReValidate = async (url: string, refreshInterval: number) => {
    const {data, error, isLoading} = useSWR(url, fetcher, {refreshInterval: refreshInterval});
    console.log(data," + ", error , " + ", isLoading);
    return data;
}

export default useFetchReValidate;