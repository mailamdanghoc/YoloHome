import { ReactNode } from "react";
import useCheckMobile from "../customizes/useCheckMobile";
import Logo from "../components/logo";
import SignInForm from "../components/user/signInForm";

const SignIn = (): ReactNode => {
    const isMobile = useCheckMobile();

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <div className="pb-10 pt-0">
                <Logo size={isMobile ? 2 : 4}/>
            </div>
            <SignInForm />
        </div>
    )
}

export default SignIn;