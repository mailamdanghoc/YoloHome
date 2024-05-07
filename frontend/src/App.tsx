import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./views/layout.tsx";
import ControlBoard from "./views/controlBoard.tsx";
import SignIn from "./views/signIn.tsx";
import Environment from "./views/environmentScreen.tsx";
import User from "./views/user.tsx";
import Home from "./views/home.tsx";

const App = () => {
    return (
        <div className="h-full w-full">
            <BrowserRouter>
                <Routes>
                    <Route path="/signup" element={<div>Hello world from sign up</div>} />
                    <Route path="/signin" element={<SignIn/>} />
                    <Route path="/" element={<Layout />}>
                        <Route path="devices" element={<ControlBoard />} />
                        <Route path="environment" element={<Environment/>} />
                        <Route path="user" element={<User/>}/>
                        <Route index element={<Home/>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;
