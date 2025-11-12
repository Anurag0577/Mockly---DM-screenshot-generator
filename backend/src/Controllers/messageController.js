import { asyncHandler } from "../Utilities/asyncHandler";

const messagesData = asyncHandler(async(req, res) => {
    const {sender, receiver, message} = req.body;
    if ( !sender || !receiver || !message){
        return res.status(400).json({message: 'Either sender, receiver or message missing!'})
    }

    console.log('data received successfully!', {sender, receiver, message})
})

export default messageController;