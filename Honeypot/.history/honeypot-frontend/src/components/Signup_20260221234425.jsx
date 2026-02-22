import { useState } from "react";
import "./Login.css";


function Signup(){

const [username,setUsername]=useState("");

const [password,setPassword]=useState("");

const checks={

length: password.length>=8,

caps: /[A-Z]/.test(password),

num: /[0-9]/.test(password),

special: /[!@#$%^&*]/.test(password)

};


const signup=async()=>{

await fetch("https://honeypot-2nso.onrender.com/api/signup",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({username,password})

});

alert("Signup Success");

};


return(

<div>

<h2>Signup</h2>


<input

placeholder="Username"

onChange={(e)=>setUsername(e.target.value)}

/>


<input

type="password"

placeholder="Password"

onChange={(e)=>setPassword(e.target.value)}

/>



<p style={{color:checks.length?"green":"red"}}>

✔ Minimum 8 characters

</p>


<p style={{color:checks.caps?"green":"red"}}>

✔ One Capital Letter

</p>


<p style={{color:checks.num?"green":"red"}}>

✔ One Number

</p>


<p style={{color:checks.special?"green":"red"}}>

✔ One Special Character

</p>



<button onClick={signup}>

Signup

</button>


</div>

);

}

export default Signup;