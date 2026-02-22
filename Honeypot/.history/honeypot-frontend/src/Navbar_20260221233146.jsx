import { Link } from "react-router-dom";

function Navbar(){

return(

<nav className="nav">

<h2>ShopEasy</h2>

<div>

<Link to="/">Home</Link>

<Link to="/login">Login</Link>

<Link to="/signup">Signup</Link>

<Link to="/dashboard">Dashboard</Link>

</div>

</nav>

);

}

export default Navbar;