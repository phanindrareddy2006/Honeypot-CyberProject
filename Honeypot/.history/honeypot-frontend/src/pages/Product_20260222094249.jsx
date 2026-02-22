import { useParams } from "react-router-dom";

function Product(){

const {id}=useParams();


fetch("https://honeypot-cyberproject.onrender.com/api/recon",{

method:"POST"

});


return(

<div>

<h2>Product Details {id}</h2>

<button>Add to Cart</button>

</div>

);

}

export default Product;