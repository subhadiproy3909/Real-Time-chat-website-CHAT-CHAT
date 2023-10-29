const express = require('express');
const router = express.Router();

const user = require('../database/Models/userModel');
const {registerUser, loggedinUser, allUsers} = require('./controllers/userControllers');
const {auth} = require('../middlewares/authMiddleware');


router.post('/user/signup', registerUser);

router.post('/user/login', loggedinUser);

router.get('/users', auth, allUsers);

// router.get('/user/login', async (req, res) => {
//     data = await user.findOne({});
//     console.log(data);
//     res.json(data);
// })


module.exports = router;