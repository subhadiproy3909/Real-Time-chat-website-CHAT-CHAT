const { populate } = require('dotenv');
const Chat = require('../../database/Models/chatModel');
const User = require('../../database/Models/userModel');


/* accessChat -> using it we are checking if the logged in user and 
    connected user already have connection for chatting or not. */
const accessChat = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("No userId provided");
        return res.sendStatus(400);
    }

    let isChatExist = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate("users", "-password").populate("latestMessage");


    isChatExist = await User.populate(isChatExist, {
        path: "latestMessage.sender",
        select: "name pic email"
    });

    if (isChatExist.length > 0) {
        res.send(isChatExist[0]);
    }
    else {
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        };

        try {
            const newChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: newChat._id }).populate("users", "-password");
            res.status(200).send(fullChat);
        } catch (err) {
            console.log(`accessChat error : ${err.message}`);
        }
    }
}


const fetchChat = async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate('users', "-password")
            .populate('groupAdmin', "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then( async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email"
                });
                res.status(200).send(results);
            })
    } catch (err) {
        console.log(`fetChat error: ${err.message}`);
    }
}

const createGroup = async (req, res) => {


    if (!req.body.users || !req.body.name) {
        return res.status(201).send("Please fill all the fields.");
    }

    const users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.status(400).send("More 1 user is required to form group.");
    }

    users.push(req.user);


    try {
        const isGroupExist = await Chat.findOne({ chatName: req.body.name });

        if (isGroupExist) {
            return res.status(400).send("Group name already used.");
        }

        const formGroup = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user
        })

        const fetchGroup = await Chat.findOne({ _id: formGroup._id }).populate("users", "-password").populate("groupAdmin", "-password");
        res.status(200).json(fetchGroup);
    }
    catch (err) {
        console.log(`createGroup error: ${err.message}`);
    }

}

const renameGroup = async (req, res) => {

    try {
        const { groupId, groupName } = req.body;

        const isGroupNameExist = await Chat.findOne({ chatName: groupName });
        if (isGroupNameExist) {
            return res.status(400).send("Duplicate Group name");
        }

        const updateGroupName = await Chat.findByIdAndUpdate(
            groupId, { chatName: groupName }, { new: true }
        ).populate("users", "-password").populate("groupAdmin", "-password");

        res.json(updateGroupName);
    } catch (err) {
        console.log(`updateChat error: ${err.message}`);
    }


}

const addToGroup = async (req, res) => {
    // res.send(req.body);
    try {
        const { userId, groupId } = req.body;

        const addUserToGroup = await Chat.findByIdAndUpdate(
            groupId, { $push: { users: userId } }, { new: true }
        ).populate("users", "-password").populate("groupAdmin", "-password");

        if (!addUserToGroup) {
            res.status(404).send("User not found");
        }
        else {
            res.json(addUserToGroup);
        }
    } catch (err) {
        console.log(`addToGroup error: ${err.message}`);
    }
}

const removeFromGroup = async (req, res) => {
    try {
        const { userId, groupId } = req.body;

        const removeUserFromGroup = await Chat.findByIdAndUpdate(
            groupId, { $pull: { users: userId } }, { new: true }
        ).populate("users", "-password").populate("groupAdmin", "-password");

        if (!removeFromGroup) {
            return res.status(404).send("User not found");
        }
        else {
            res.json(removeUserFromGroup);
        }
    }
    catch (err) {
        console.log(`removeFromGroup error: ${err.message}`);
    }
}


module.exports = { accessChat, fetchChat, createGroup, renameGroup, addToGroup, removeFromGroup };