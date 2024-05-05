import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import axios from "axios";
import { redirect } from "react-router-dom";

//server route
const userURL: string = "http://localhost:3001/api/v1/accounts"; // + "/:id" 

const useUserFetch = (props : {userId: string, token: string}) => {
//fetcher
    const userFetcher = async (params: {
        url: string,
        token: string
    }) => {
        const res = await axios.get(params.url, {
            headers: {
                Authorization: "bearer " + params.token
            }
        })
        .catch(error => {
            const err = new Error(error.response.status + "-" + error.response.data.message);
            throw err;
        })
        return res.data;
    }

    const userUpdate = async (params: {
        url: string,
        token: string
    }, {arg} : {arg: {
        fullname?: string,
        email?: string,
        phone?: string,
        oldPassword?: string,
        newPassword?: string
    }}) => {
        const res = await axios.patch(params.url,  arg, {
            headers: {
                Authorization: "bearer " + params.token
            }
        })
        .then(res => {
            console.log(res.data);
            mutate();
        })
        .catch((error) => {
            const err = new Error(error.response.status + "-" + error.response.data.message);
            console.log(err)
            throw error;
        })
    }


    const {data, mutate, error, isValidating} = useSWR({url: userURL + `/${props.userId}`, token: props.token}, userFetcher, {
        keepPreviousData: true
    })

    const {trigger: editTrigger, error: editError} = useSWRMutation({url: userURL + `/${props.userId}`, token: props.token}, userUpdate);

    const {trigger: passwordTrigger, error: passwordError} = useSWRMutation({url: userURL + `/${props.userId}` + "/password", token: props.token}, userUpdate);

    return {data, mutate, editTrigger, editError, error, passwordTrigger, passwordError, isValidating}
}

export {useUserFetch}