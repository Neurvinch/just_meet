import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Camera, CreditCard, Lock, ShieldCheck, Sparkles } from 'lucide-react';

const Payement = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState(''); // State to store dynamic amount

    const handlePayement = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!amount || isNaN(amount) || amount <= 0) {
                alert('Please enter a valid amount');
                return;
            }

            const { data } = await axios.post(
                'http://localhost:5000/api/payement/create-order',
                { amount: Number(amount) }, // Convert to number
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            const { order } = data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount, // Amount from server (in paise)
                currency: order.currency,
                name: 'freelance_it',
                description: 'Test Transaction',
                order_id: order.id,
                handler: async function (response) {
                    const token = localStorage.getItem('token');
                    try {
                        const verifyRes = await axios.post(
                            'http://localhost:5000/api/payement/verify',
                            {
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                            },
                            {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                },
                                withCredentials: true,
                            }
                        );

                        if (verifyRes.data.success) {
                            alert('Payment verified successfully');
                            navigate('/');
                        } else {
                            alert('Payment failed');
                        }
                    } catch (error) {
                        console.log('Verification error:', error);
                    }
                },
                prefill: {
                    name: 'freelance_it',
                    email: '8tjXJ@example.com',
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.log('Payment initiation error:', error);
        }
    };

    const backgroundImages = [
        { src: '/p1.png', top: 'top-10', left: 'left-5' },
        { src: '/p2.webp', top: 'top-1/4', right: 'right-10' },
        { src: '/p3.jpg', bottom: 'bottom-20', left: 'left-1/3' },
        { src: '/p5.png', top: 'top-1/2', right: 'right-1/4' },
        { src: '/p6.png', bottom: 'bottom-10', right: 'right-1/3' },
    ];

    return (
        <div className="relative min-h-screen pixel-font bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="grid grid-cols-12 grid-rows-12 h-full w-full opacity-10">
                    {[...Array(144)].map((_, index) => (
                        <div
                            key={index}
                            className="border border-gray-300 dark:border-gray-700"
                        ></div>
                    ))}
                </div>
            </div>

            {/* Background Images */}
            {backgroundImages.map((image, index) => (
                <div
                    key={index}
                    className={`absolute ${image.top || ''} ${image.bottom || ''} ${image.left || ''} ${image.right || ''} opacity-20 z-0`}
                >
                    <img
                        src={image.src}
                        alt={`Background image ${index + 1}`}
                        className="rounded-2xl shadow-lg transform rotate-6 hover:rotate-0 transition-all duration-300 w-30 h-30"
                    />
                </div>
            ))}

            {/* Payment Container */}
            <div className="relative z-10 flex items-center justify-center min-h-screen">
                <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-96 transform transition-all hover:scale-105">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment</h2>
                        <p className="text-gray-600">Secure Transaction</p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-blue-50 rounded-lg p-4 flex items-center">
                            <CreditCard className="mr-3 text-blue-600" />
                            <div className="w-full">
                                <p className="font-semibold text-gray-700">Enter Amount</p>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount in ₹"
                                    className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="1"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handlePayement}
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
                        >
                            <Lock className="mr-2" />
                            Proceed to Pay
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500 flex items-center justify-center">
                            <ShieldCheck className="mr-2 text-green-600" />
                            Secured by Razorpay
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payement;