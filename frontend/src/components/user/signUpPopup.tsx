import { IoClose } from "react-icons/io5";
import { ReactElement, useState, useEffect, useCallback, ChangeEvent } from "react";
import formError from "../../utils/formError";
import { TriggerWithArgs } from "swr/mutation";

interface signUpProps {
    handlePopupOpen: () => void
    trigger: TriggerWithArgs<void, any, any, {
        username: string,
        fullname?: string,
        email?: string,
        phone?: string
    }>
}

const SignUpPopup = (props: signUpProps): ReactElement => {
    const [userName, setUserName] = useState<string>("");
    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>(""); 
    const [error, setError] = useState<formError>((new formError)
                                                    .addError("userName", ["User Name is required"])
                                                    .addError("email", ["Invalid email format"])
                                                    .addError("phone", ["Invalid phone number format"])
                                                );
    
    const handleUserNameOnChange = useCallback((e: ChangeEvent): void => {
        const value = (e.target as HTMLInputElement).value;
        if(value === "") setError(error.setErrorStatus("userName", 1));
        else setError(error.setErrorStatus("userName", 0))
        setUserName(value);
    }, [error])

    const handleFullNameOnChange = useCallback((e: ChangeEvent): void => {
        const value = (e.target as HTMLInputElement).value;
        setFullName(value);
    }, []) 

    const handleEmailOnChange = useCallback((e: ChangeEvent): void => {
        const value = (e.target as HTMLInputElement).value;
        setEmail(value);
         // simple regex for email 
        if (value == "") setError(error.setErrorStatus("email", 0));
        else setError(error.setErrorStatus("email", value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) ? 0 : 1));
    }, [error])

    const handlePhoneOnChange = useCallback((e: ChangeEvent): void => {
        const value = (e.target as HTMLInputElement).value;
        setPhone(value);
        // validate phone number
        if (value == "") setError(error.setErrorStatus("phone", 0));
        else setError(error.setErrorStatus("phone", isNaN(Number(value)) ? 1 : 0));
    }, [error])

    const handleSubmit = useCallback(() => {
        if(userName.length == 0) {
            setError(error.setErrorStatus("userName", 1));
            return;
        }
        if(error.currentExist()) return;
        const data = {
            username: userName,
            fullname: fullName.length != 0 ? fullName : undefined,
            email: email.length != 0 ? email : undefined,
            phone: phone.length != 0 ? phone : undefined
        }
        
        props.trigger(data);
        props.handlePopupOpen();
    }, [userName, fullName, email, phone, error])

    return (
        <div className="fixed inset-0 h-full w-full flex items-center justify-center">
            <div className="fixed inset-0 h-full w-full z-90 bg-gray-800/50 hover:cursor-pointer" onClick={() => props.handlePopupOpen()}></div>
            <div className={`w-full h-fit max-w-sm md:max-w-md px-6 py-3 z-0 bg-white hover:cursor-default`}>
                <div className="mb-6 text-xl md:text-2xl text-gray-500 font-semibold">
                    Add New Account
                </div>
                <div className="mt-3">
                    <div className="text-md text-gray-500 font-semibold">
                        User Name
                    </div>
                    <input type="text" className={`w-full mt-2 border rounded-md px-3 py-1 ${error.isExist("userName") ? "border-red-500 focus:outline-red-500" : "border-gray-300 focus:outline-gray-700"}`} placeholder="Set user name"
                    onChange={(e: ChangeEvent) => handleUserNameOnChange(e)} />
                </div>
                <div className="mt-3">
                    <div className="text-md text-gray-500 font-semibold">
                        Full Name
                    </div>
                    <input type="text" className="w-full mt-2 border rounded-md px-3 py-1 border-gray-300 focus:outline-gray-700" placeholder="Set full name"
                    onChange={(e: ChangeEvent) => handleFullNameOnChange(e)} />
                </div>
                <div className="mt-3">
                    <div className="text-md text-gray-500 font-semibold">
                        Email
                    </div>
                    <input type="text" className={`w-full mt-2 border rounded-md px-3 py-1 ${error.isExist("email") ? "border-red-500 focus:outline-red-500" : "border-gray-300 focus:outline-gray-700"}`} placeholder="Set email"
                    onChange={(e: ChangeEvent) => handleEmailOnChange(e)} />
                </div>
                <div className="mt-3">
                    <div className="text-md text-gray-500 font-semibold">
                        Phone Number
                    </div>
                    <input type="text" className={`w-full mt-2 border rounded-md px-3 py-1 ${error.isExist("phone") ? "border-red-500 focus:outline-red-500" : "border-gray-300 focus:outline-gray-700"}`} placeholder="Set phone number"
                    onChange={(e: ChangeEvent) => handlePhoneOnChange(e)} />
                </div>
                <div className={`mt-3 flex ${error.currentExist() ? "text-red-500" : "text-transparent"}`}>
                    <IoClose size={25} />
                    <span>{error.currentExist() ? error.toString(error.currentExist()!) : ""}</span>
                </div>
                <div className="mt-3 flex">
                    <button className="h-fit w-fit p-2 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-300 focus:outline-sky-500 text-white font-semibold"
                    onClick={() => handleSubmit()} >
                        Confirm
                    </button>
                    <button className="h-fit w-fit mx-2 p-2 rounded-lg bg-gray-300 focus:outline-gray-500 text-gray-500 font-semibold"
                    onClick={() => props.handlePopupOpen()} >
                        Cancel
                    </button>
                </div>

            </div>
        </div>
    )

}

export default SignUpPopup;