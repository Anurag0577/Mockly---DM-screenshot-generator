import {User} from '../Models/User.model.js'

const CREDIT_PLAN = {
    standard: 10,
    gold: 50
}

const addCreditsToAccount = async(req, res) => {
    const userDetails = req.user;
    if(!userDetails) return res.send('User not found!')
    const plan = req.body.plan;
    const userId = userDetails._id;

    if(!CREDIT_PLAN[plan]){
        return res.status(400).json({ error: "Invalid plan selected" });
    }

    try {
        const updatedCredit = await User.findByIdAndUpdate(userId, {$inc: {credit : CREDIT_PLAN[plan]}}, {new: true})

        return res.status(200).json({ 
            updatedCredit, 
            status: 'ok',
            message: `Added ${CREDIT_PLAN[plan]} more credits!` 
        });
    } catch (err) {
        return res.status(500).json({ 
            error: "Failed to update credits", 
            details: err.message 
        });
    }
}


export default addCreditsToAccount;