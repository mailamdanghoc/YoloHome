import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./views/layout.tsx";
import ControlBoard from "./components/controlBoard.tsx";
import Environment from "./components/environmentScreen.tsx";

const App = () => {
    return (
        <div className="h-screen w-full">
            <BrowserRouter>
                <Routes>
                    <Route path="/signup" element={<div>Hello world from sign up</div>} />
                    <Route path="/signin" element={<div>Hello world from sign in</div>} />
                    <Route path="/" element={<Layout />}>
                        <Route path="home" element={<Environment />} />
                        <Route path="home1" element={<div>Home 2</div>} />
                        <Route index element={<div>Hello world</div>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;
