import { Link } from "react-router-dom";
import "./Login.css";

function Navbar(){

return(

<nav>

<div style={{marginRight:"auto"}}>

<Link to="/">ShopEasy</Link>

</div>

<Link to="/login">Login</Link>

<Link to="/signup">Signup</Link>

<Link to="/dashboard">Dashboard</Link>

<Link to="/admin">Admin</Link>

</nav>

);

}

export default Navbar;