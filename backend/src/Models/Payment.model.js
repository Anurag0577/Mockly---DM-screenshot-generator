import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    amount: Number,
    planType: {
        type: String,
        enum: ["50-credit-pack", "lifetime"],
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },
},
    { timestamps: true }
)

const Payment = mongoose.model('Payment', paymentSchema)

export {Payment}
