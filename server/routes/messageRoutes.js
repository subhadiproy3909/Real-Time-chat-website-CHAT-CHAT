const express = require('express');
const router = express.Router();

const {auth} = require('../middlewares/authMiddleware');
const {sendMessage} = require('./controllers/messageControllers');
const Message = require('../database/Models/messageModel');
const User = require('../database/Models/userModel');
const Chat = require('../database/Models/chatModel');


// router.post('/', auth, sendMessage);
// router.get('/:childId', auth, allMessage);

router.post('/', auth, async (req, res) =>{
    const {content, chatId} = req.body;

    // res.send(content)

    if(!content || !chatId){
        console.log("Empty object request");
        return res.sendStatus(400).send("Empty object request");
    }

    const newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }

    try {
        let message = await Message.create(newMessage);
    
        message = await message.populate("sender", "name email pic");
        message = await message.populate("chat");
        // message = await User.populate(message, {
        //     path: 'chat.users',
        //     select: "name email pic",
        // })

        await Chat.findByIdAndUpdate(chatId, {latestMessage: message});
        res.json(message);
    } catch (error) {
        res.status(400)
        throw new Error(error.message);
    }


}) 


router.get('/:chatId', auth, async (req, res) =>{
    try{
        const message = await Message.find({chat: req.params.chatId})
        .populate("sender", "name email pic")
        .populate("chat");

        res.send(message);
    }
    catch(err){
        res.status(400);
        throw new Error(err.message);
    }
})

module.exports = router;