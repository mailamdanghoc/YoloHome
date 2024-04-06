import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./views/layout.tsx";
import ControlBoard from "./views/controlBoard.tsx";
import SignIn from "./views/signIn.tsx";

const App = () => {
    return (
        <div className="h-screen w-full">
            <BrowserRouter>
                <Routes>
                    <Route path="/signup" element={<div>Hello world from sign up</div>} />
                    <Route path="/signin" element={<SignIn/>} />
                    <Route path="/" element={<Layout />}>
                        <Route path="devices" element={<ControlBoard />} />
                        <Route path="home1" element={<div>Home 2</div>} />
                        <Route index element={<div>Hello world</div>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;
