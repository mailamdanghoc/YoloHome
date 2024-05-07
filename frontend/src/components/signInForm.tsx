import { IoClose } from "react-icons/io5";
import { ChangeEvent, ReactElement, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const signInURL: string = "http://localhost:3001/api/v1/accounts/signin";

const SignInForm = (): ReactElement => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string>("");

    const navigate = useNavigate();

    const handleEmailOnChange = (event: ChangeEvent): void => {
        const newValue = (event.target as HTMLInputElement).value;
        setUsername(newValue);
    }

    const handlePasswordOnChange = (event: ChangeEvent): void => {
        const newValue = (event.target as HTMLInputElement).value;
        setPassword(newValue);
    }

    const handleSubmit = (): void => {
        setErrorMsg("");
        const data = {
            username: username,
            password: password
        };
        axios.post(signInURL, data)
        .then((res): void => {
            const data = res.data;
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.account.id);
            navigate("/");
        })
        .catch((error): void => {
            const errResponse = error.response;
            switch (errResponse.status) {
                case 404:
                    setErrorMsg("User name or password is incorrect or your account has been deactivated!");
                    break;
                case 403:
                    setErrorMsg("User name or password is incorrect or your account has been deactivated!");
                    break;
                case 400:
                    if (errResponse.data.message == "Username or password is missing") setErrorMsg("Both fields are required!");
                    break;
                default:
                    //navigate to error page
                    setErrorMsg("Try again later");
                    break;
            }
        })
    }

    return (
        <div className="w-full bg-white rounded-lg shadow md:mt-0 max-w-sm md:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-500 md:text-2xl">
                    Welcome back!
                </h1>
                <div className="space-y-4 md:space-y-6">
                    <div>
                        <span className="block mb-2 text-sm font-medium text-gray-500 ">User Name</span>
                        <input type="text" name="username" onChange={(event) => handleEmailOnChange(event)}
                        className="w-full bg-gray-50 border border-gray-300 text-gray-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5" 
                        placeholder="Your User Name"/>
                    </div>
                    <div>
                        <span className="block mb-2 text-sm font-medium text-gray-500">Password</span>
                        <input type="password" name="password" placeholder="••••••••" onChange={(event) => handlePasswordOnChange(event)}
                        className="w-full bg-gray-50 border border-gray-300 text-gray-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5" 
                        />
                    </div>
                    <span className={`flex mb-2 text-sm font-medium text-red-500 ${errorMsg.length == 0 ? "h-0 text-transparent" : ""}`}>
                        <IoClose size={20}/>
                        {errorMsg}
                    </span>
                    <button type="submit" onClick={() => handleSubmit()}
                    className="w-full text-sm px-5 py-2.5 font-medium rounded-lg text-center text-gray-700 bg-sky-300 hover:bg-sky-400 focus:ring-4 focus:outline-none focus:ring-primary-300"
                    >Sign in
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SignInForm;