import Header from "./Header";
import { Button } from "./ui/button";

export default function BuyCredits(){

    return <>
        <Header/>
        <div className="subscription-card-container h-full w-full flex flex-col justify-center items-center">
            <h1 className="text-3xl text-bolder mb-5 mt-7 tracking-tight dark:text-white">Pricing</h1>
            <p className=" w-[70%] text-center dark:text-white">Ready to trick your friends? Every credit unlocks a new opportunity for viral chaos. Grab your pack and start crafting the perfect prank!</p>
            <div className="card-container flex justify-center items-center mt-20 gap-x-10 w-full p-5">
                <div className="cardOne flex flex-col justify-start items-center h-fit w-[30%] bg-white border rounded-[20px] p-4 dark:bg-transparent dark:border-white">
                    <p className="text-[10px] tracking-widest ">BEST VALUE</p>
                    <h1 className="text-2xl font-bold">Standard</h1>
                    <p className="text-sm mb-6 text-center ">Perfect for testing the quality and getting started.</p>
                    <div className="flex justify-center items-center gap-6">
                        {/* <div className="price text-4xl text-bolder font-semibold line-through text-[#496b01] ">$149</div> */}
                        <div className="discounted-price text-4xl font-semibold ">₹100</div>
                    </div>
                    <span className="my-5">10 Credits (₹10 per generation)</span>
                    <div className="bg-black text-white w-full text-center py-3 rounded-[50px]">Buy 10 Credits</div>
                </div>
                <div className="cardOne flex flex-col justify-start items-center h-fit w-[30%] bg-[#cdf96e] rounded-[20px] p-4 dark:text-black">
                    <p className="text-[10px] tracking-widest ">HEAVY USE</p>
                    <h1 className="text-2xl font-bold">Gold</h1>
                    <p className="text-sm mb-6 text-center ">Ideal for social media content, pranking friends & daily use.</p>
                    <div className="flex justify-center items-center gap-6">
                        <div className="price text-4xl text-bolder font-semibold line-through text-[#496b01] ">₹500</div>
                        <div className="discounted-price text-4xl font-semibold ">₹400</div>
                    </div>
                    <span className="my-5">50 Credits (only ₹8 per generation)</span>
                    <div className="bg-black text-white w-full text-center py-3 rounded-[50px]">Buy 50 Credits</div>
                </div>
            </div>
        </div>
    </>
}