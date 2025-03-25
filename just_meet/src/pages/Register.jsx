import React, { useState } from 'react'
 import axios from 'axios'
 const apiUrl = import.meta.env.VITE_API_URL;
const Register = () => {
    const [formData , setFormData] = useState({
        name : "",
        email : "",
        password : "",
    });

    const [error ,setError ] = useState("");
    const [success , setSuccess] = useState("");
    const [loading , setLoading] = useState(false);

     const handleSubmit = async (e) => {
        e.preventDefault();
           setError("");
           setLoading(true);

           if(!formData.name || !formData.email || !formData.password) {
            setError("Please fill all fields");
            setLoading(false);
            return;
           }


           try {

             const res = await axios.post(`${apiUrl}/api/register` , formData); 

             if(res.data.success) {
                setSuccess(res.data.message);
                setLoading(false);
                setFormData({
                    name : "",
                        email : "",
                        password : "",
                        });
             }

            
           } catch (error) {
             setError(error.message);
           }
     }
  return (
    <div>
        <form onSubmit={handleSubmit}>  
            <label> Name:</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData , name : e.target.value})} />

            <label> Email:</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...
            formData , email : e.target.value})} />

            <label> Password:</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({...
            formData , password : e.target.value})} />

            <button type="submit">Register</button>
            
        </form>
    </div>
  )
}

export default Register