import api from "@/api/axios";
import Header from "./Header";
import { Button } from "./ui/button"; // Assuming Button is not used, but kept for completeness

export default function BuyCredits(){

    // Define prices in Rupees (for display and logic simplicity)
    const STANDARD_PLAN_PRICE_RUPEES = 1;
    const GOLD_PLAN_PRICE_RUPEES = 400;

    /**
     * Utility function to dynamically load the Razorpay script.
     * @param {string} src - The URL of the script.
     * @returns {Promise<boolean>} Resolves to true on success, false on error.
     */
    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement('script')
            script.src = src
            script.onload = () => { resolve(true) }
            script.onerror = () => { resolve(false) }
            document.body.appendChild(script)
        })
    }

    /**
     * Initializes and displays the Razorpay payment modal.
     * @param {number} amountRupees - The amount in INR (Rupees).
     * @param {string} purchasedPlan - The plan being purchased (e.g., "standard", "gold").
     */
    async function displayRazorpay (amountRupees, purchasedPlan) {
        
        // 1. Load the Razorpay script
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

        if (!res){
            alert('Razorpay failed to load! Check your network connection.')
            return 
        }

        const amountPaise = amountRupees * 100; // Convert Rupees to Paise

        try {
            // 2. Create the Order on your Backend
            // 🚨 CRITICAL FIX: Use a regular API call, not the useQuery hook here!
            // Send amount as RUPEES to backend (backend will convert to paise)
            const orderResponse = await api.post('/payment/create-order', {
                amount: amountRupees,
                currency: 'INR'
            });

            const orderData = orderResponse.data;

            if (!orderData || !orderData.order_id) {
                console.error('Create order response:', orderResponse);
                alert('Failed to create payment order.');
                return;
            }

            console.log('Order created successfully:', orderData);

            // 3. Configure Razorpay Options
            const options = {
                "key": "rzp_test_Rro0eLVmnJ7EBr", // Replace with your actual key
                "amount": amountPaise, 
                "currency": "INR",
                "name": "Mockly",
                "description": "Purchase Credits",
                "order_id": orderData.order_id, // Use the order_id from the backend response
                "handler": async function (response) {
                    // 4. Verify Payment on Backend
                    try {
                        const verificationResponse = await api.post('/payment/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        const data = verificationResponse.data;

                        if (data.status === 'ok') {
                            // calling api that increases credits based on the plan purchased
                            const addCreditsToAccount = await api.post('/add-credit', {
                                plan: purchasedPlan
                            });

                            if(addCreditsToAccount.data.status === '200'){
                                window.location.href = '/';
                            }

                        } else {
                            alert('Payment verification failed. Please contact support.');
                        }
                    } catch (error) {
                        console.error('Error verifying payment:', error);
                        alert('Error verifying payment.');
                    }
                },
                "prefill": {
                    // Optional: Prefill user details if available
                    // "name": "User Name",
                    // "email": "user@example.com",
                    // "contact": "9999999999"
                },
                "theme": {
                    "color": "#3399cc"
                }
            };
            
            // 4. Open the Payment Gateway
            const paymentObject = new window.Razorpay(options); 
            paymentObject.open();

        } catch (error) {
            console.error('Payment initialization error:', error);
            alert('There was an error initiating the payment. Please try again.');
        }
    }

    return (
        <>
            <Header/>
            <div className="subscription-card-container h-full w-full flex flex-col justify-center items-center">
                <h1 className="text-2xl text-bolder mb-5 mt-7 tracking-tight dark:text-white">Pricing</h1>
                <p className=" w-[70%] text-sm text-center dark:text-white">Ready to trick your friends? Every credit unlocks a new opportunity for viral chaos. Grab your pack and start crafting the perfect prank!</p>
                <div className="card-container flex flex-col md:flex-row justify-center items-center mt-10 gap-6 w-full p-5">
                    
                    {/* Standard Plan Card */}
                    <div className="cardOne flex flex-col justify-start items-center h-fit w-[90%] md:w-[30%] bg-white border rounded-[20px] p-4 dark:bg-transparent dark:border-white ">
                        <p className="text-[10px] tracking-widest ">BEST VALUE</p>
                        <h1 className="text-2xl font-bold">Standard</h1>
                        <p className="text-sm mb-6 text-center ">Perfect for testing the quality and getting started.</p>
                        <div className="flex justify-center items-center gap-6">
                            <div className="discounted-price text-4xl font-semibold ">₹{STANDARD_PLAN_PRICE_RUPEES}</div>
                        </div>
                        <span className="my-5">10 Credits (₹10 per generation)</span>
                        {/* 🚨 CRITICAL FIX: Wrap in arrow function */}
                        <div 
                            className="bg-black text-white w-full text-center py-3 rounded-[50px] cursor-pointer" 
                            onClick={() => displayRazorpay(STANDARD_PLAN_PRICE_RUPEES , 'standard')} 
                        >
                            Buy 10 Credits
                        </div>
                    </div>
                    
                    {/* Gold Plan Card */}
                    <div className="cardOne flex flex-col justify-start items-center h-fit w-[90%] md:w-[30%] bg-[#cdf96e] rounded-[20px] p-4 dark:text-black">
                        <p className="text-[10px] tracking-widest ">HEAVY USE</p>
                        <h1 className="text-2xl font-bold">Gold</h1>
                        <p className="text-sm mb-6 text-center ">Ideal for social media content, pranking friends & daily use.</p>
                        <div className="flex justify-center items-center gap-6">
                            <div className="price text-4xl text-bolder font-semibold line-through text-[#496b01] ">₹500</div>
                            <div className="discounted-price text-4xl font-semibold ">₹{GOLD_PLAN_PRICE_RUPEES}</div>
                        </div>
                        <span className="my-5">50 Credits (only ₹8 per generation)</span>
                        {/* 🚨 CRITICAL FIX: Wrap in arrow function */}
                        <div 
                            className="bg-black text-white w-full text-center py-3 rounded-[50px] cursor-pointer" 
                            onClick={() => displayRazorpay(GOLD_PLAN_PRICE_RUPEES , 'gold')} 
                        >
                            Buy 50 Credits
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}