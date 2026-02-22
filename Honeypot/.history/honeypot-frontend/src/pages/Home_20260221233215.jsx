import { Link } from "react-router-dom";

function Home(){

return(

<div>

<h1>Welcome to ShopEasy</h1>

<div className="products">

<Link to="/product/1">

<div className="card">

<h3>iPhone 15</h3>

<p>$999</p>

</div>

</Link>


<Link to="/product/2">

<div className="card">

<h3>Laptop</h3>

<p>$799</p>

</div>

</Link>


</div>

</div>

);

}

export default Home;