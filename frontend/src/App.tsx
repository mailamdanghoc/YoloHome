import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./views/Layout";

const App = () => {
    return (
        <div className="h-screen w-screen">
            <BrowserRouter>
                <Routes>
                    <Route path="/signup" element={<div>Hello world from sign up</div>} />
                    <Route path="/signin" element={<div>Hello world from sign in</div>} />
                    <Route path="/" element={<Layout/>}>
                        <Route index element={<div>Hello world</div>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;
