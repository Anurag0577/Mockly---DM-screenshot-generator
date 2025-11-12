import { asyncHandler } from "../Utilities/asyncHandler.js";

const previewData = asyncHandler((req, res) => {
    const {sender, receiver, messages, receiverAvatar, senderAvatar} = req.body;

    if( !sender || !receiver || !messages){
        return res.status(401).send('Either sender, receiver or messages not found!')
    }

    res.status(200).json({message: "Data received successfully!"})
})

export {previewData};