const user = require('../../database/Models/userModel');
const generateToken = require('../../database/db/generateToken');


const registerUser = async (req, res) =>{
    const {name, email, password, pic} = req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new Error('Please enter all the fields');
    }

    const userExists = await user.findOne({email});

    if(userExists){
        res.status(400);
        throw new Error('User already exists');
    }

    const User = await user.create({
        name,
        email,
        password,
        pic
    });

    if(User){
        res.status(201).json({
            _id: User._id,
            name: User.name,
            email: User.email,
            pic: User.pic,
            token: generateToken(User._id)
        })
    }
    else{
        res.status(400);
        throw new Error("Failed to save in DB");
    }
}

const loggedinUser = async (req, res) =>{
    const {email, password} = req.body;

    const User = await user.findOne({email});

    if(User && (await User.hashedPassword(password))){
        res.json({
            _id: User._id,
            name: User.name,
            email: User.email,
            pic: User.pic,
            token: generateToken(User._id)
        })
    }
    else{
        res.status(404);
        throw new Error("Invalid credentials");
    }
}

const allUsers = async (req, res) =>{

    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i"}},
            { email: { $regex: req.query.search, $options: "i"}}
        ]
    } : {};

    const users = await user.find(keyword).find({ _id: { $ne: req.user._id} });
    res.send(users);
}


module.exports = {registerUser, loggedinUser, allUsers};