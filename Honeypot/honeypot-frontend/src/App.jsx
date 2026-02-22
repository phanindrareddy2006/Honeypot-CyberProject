import { BrowserRouter,Routes,Route }

from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";

import Login from "./components/Login";

import Signup from "./components/Signup";

import Dashboard from "./components/Dashboard";

import Product from "./pages/Product";


function App(){

return(

<BrowserRouter>

<Navbar/>


<Routes>

<Route path="/" element={<Home/>}/>

<Route path="/login" element={<Login/>}/>

<Route path="/signup" element={<Signup/>}/>

<Route path="/dashboard" element={<Dashboard/>}/>

<Route path="/product/:id" element={<Product/>}/>

</Routes>


</BrowserRouter>

);

}

export default App;