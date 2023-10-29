const express = require('express');
const router = express.Router();


const {auth} = require('../middlewares/authMiddleware');
const {accessChat, fetchChat, createGroup, renameGroup, addToGroup, removeFromGroup} = require("./controllers/chatControllers");


router.post('/', auth, accessChat);
router.get('/', auth, fetchChat);
router.post('/group', auth, createGroup);
router.put('/rename', auth, renameGroup);
router.put('/groupadd', auth, addToGroup);
router.put('/groupremove', auth, removeFromGroup);


module.exports = router;