import { useState } from "react";

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

await fetch("/api/signup",{

method:"POST",

headers:{"Content-Type":"application/json"},

body:JSON.stringify({username,password})

});

};


return(

<div>

<h2>Signup</h2>

<input placeholder="username"

onChange={(e)=>setUsername(e.target.value)}

/>


<input type="password"

placeholder="password"

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