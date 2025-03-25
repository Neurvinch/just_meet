const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorPayInstance = new Razorpay({
    key_id: process.env.VITE_RAZORPAY_KEY_ID,
    key_secret: process.env.VITE_RAZORPAY_KEY_SECRET,

});

exports.createOrder = async(req,res) =>{
    try {
        const {amount} =req.body;
        
        const options ={
            amount : amount * 100,
            currency : "INR",
            receipt  : `receipt_order_${Math.random().toString(36).slice(2, 9)}`,
        }

        const order = await razorPayInstance.orders.create(options);
        return res.status(200).json({success : true , order});
        
    } catch (error) {
        
        return res.status(500).json({success : false , message : error.message});

    }
} ;


exports.verifyPayement = (req,res) =>{
try {
    const {razorpay_order_id , razorpay_payement_id, razorpay_signature} = req.body;

    const hmac = crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET);

    hmac.update(razorpay_order_id + "|" + razorpay_payement_id);

    const generateSignatare = hmac.digest('hex');

    if(generateSignatare === razorpay_signature){
        return res.status(200).json({success : true , message : "Payment verified successfully"});

    } else {
        return res.status(400).json({success : false , message : "Payment verification failed"});
    }
    
} catch (error) {
     return res.status(500).json({success : false , message : error.message});
}

}
