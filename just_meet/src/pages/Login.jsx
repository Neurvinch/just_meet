import React, { useState } from 'react'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
    const [formData , setFormData] = useState({
        name : "",
        password : "",
    })

     const [error , setError] = useState("")

     const [loading , setLoading] = useState(false);

     const handleSubmit = async (e) => {
         e.preventDefault();
           setError(" ");
           setLoading(true);
           
           try {
            const res = await axios.post(`${apiUrl}/api/login`,formData);

            if(res.data.success) {
                const token = res.data.token;
                localStorage.setItem("token" , token);
                console.log("Login Success");
            } 
            
            
           } catch (error) {
             setError(error.message);
           }
           setLoading(false);
     }
  return (
    <div>
        <form onSubmit={handleSubmit} >
             <input
              type="text"
              placeholder='Name'
              value={formData.name}
              onChange={(e) => setFormData({...formData , name : e.target.value})}
              required
             />

             <input
              type= "password"
              placeholder='Password'
              value={formData.password}
              onChange={(e) => setFormData({...formData , password : e.target.value})}
              required
             />
             <button type = "submit">
                Login
             </button>
        </form>

     
    </div>
  )
}

export default Login