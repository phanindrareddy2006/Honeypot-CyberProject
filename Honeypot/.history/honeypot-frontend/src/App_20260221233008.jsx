import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Admin from "./components/Admin";
import Dashboard from "./components/Dashboard";

import "./App.css";

function App(){

return(

<BrowserRouter>

<nav>

<Link to="/">Login</Link>

<Link to="/signup">Signup</Link>

<Link to="/dashboard">Dashboard</Link>

<Link to="/admin">Admin</Link>

</nav>


<Routes>

<Route path="/" element={<Login/>} />

<Route path="/signup" element={<Signup/>} />

<Route path="/dashboard" element={<Dashboard/>} />

<Route path="/admin" element={<Admin/>} />

</Routes>


</BrowserRouter>

);

}

export default App;