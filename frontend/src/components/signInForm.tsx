import { ChangeEvent, useState } from "react";
import axios, { Axios, AxiosResponse } from "axios";

const signInURL: string = "";

const SignInForm = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string>("");

    const handleEmailOnChange = (event: ChangeEvent): void => {
        const newValue = (event.target as HTMLInputElement).value;
        setEmail(newValue);
    }

    const handlePasswordOnChange = (event: ChangeEvent): void => {
        const newValue = (event.target as HTMLInputElement).value;
        setPassword(newValue);
    }

    const handleSubmit = (): void => {
        const data = {
            email: email,
            password: password
        };

        axios.post(signInURL, {data})
        .then((res: AxiosResponse) => {
            window.location.href = "/";
        })
        .catch((error) => {
            if(error.response) {
                console.log(error.response.data);
                setErrorMsg("Incorrect Email or Password");
            }
            else setErrorMsg("");
        })
    }

    return (
        <div className="w-full bg-white rounded-lg shadow md:mt-0 max-w-sm md:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-500 md:text-2xl">
                    Welcome back
                </h1>
                <div className="space-y-4 md:space-y-6">
                    <div>
                        <span className="block mb-2 text-sm font-medium text-gray-500 ">Your email</span>
                        <input type="email" name="email" onChange={(event) => handleEmailOnChange(event)}
                        className="w-full bg-gray-50 border border-gray-300 text-gray-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5" 
                        placeholder="Your email"/>
                    </div>
                    <div>
                      <span className="block mb-2 text-sm font-medium text-gray-500">Password</span>
                      <input type="password" name="password" placeholder="••••••••" onChange={(event) => handlePasswordOnChange(event)}
                      className="w-full bg-gray-50 border border-gray-300 text-gray-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5" 
                      />
                    </div>
                    <div className={errorMsg.length == 0 ? "hidden" : "block"}>
                        <span className="block mb-2 text-sm font-medium text-red-500">
                            {errorMsg}
                        </span>
                    </div>
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