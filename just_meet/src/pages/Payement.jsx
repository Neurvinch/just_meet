import axios from 'axios';
import React from 'react'
// import { useNavigate } from 'react-router-dom'

const Payement = () => {
    // const navigate = useNavigate();

    const handlePayement = async () =>{
             try { 
                const token = localStorage.getItem('token');
                const amount = 500;

                const {data} = await axios.post("http://localhost:5000/api/payement/create-order" , {amount},
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                            },
                            withCredentials: true
                    }
                );

                const {order} = data;

                const options ={
                    key : import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount : order.amount,
                    currency :order.currency,
                    name : "freelance_it",
                    description : "Test Transaction",
                    order_id : order.id,
                    handler : async function (response) {
                        const token = localStorage.getItem('token');
                      try {
                        const verifyRes = await axios.post("http://localhost:5000/api/payement/verify", {
                          razorpay_payment_id : response.razorpay_payment_id,
                          razorpay_order_id : response.razorpay_order_id,
                          razorpay_signature : response.razorpay_signature
                        } ,{
                            headers: {
                                'Authorization': `Bearer ${token}`
                                },
                                withCredentials: true
                                
                        });

                        if(verifyRes.data.success) {
                            alert("Payment verified successfully");
                            // navigate("/");
                        } else {
                            alert("Payment failed");
                        }

                        
                      } catch (error) {
                         console.log(error);

                      }
                    },
                    prefill : {
                      name : "freelance_it",
                      email : "8tjXJ@example.com",
                      },
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.open();
                
             } catch (error) {
                console.log(error);
             }
    }
  return (
    <div>
        <h2>Payement</h2>
        <button onClick={handlePayement}>Pay</button>
    </div>
  )
}

export default Payement