const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');
const UserModel = require('../models/user.schema');

router.post('/changeUsername', async (req,res) => {
    const {userId, userName} = req.body;
    try {
        const confirmedUser = await userService.changeUsername(userId, userName);
        res.status(200).json(confirmedUser); 
    }catch(error){
        res.status(400).json({message: `Fail to change userName of ${userId}`})
    }
});

router.post('/changeTags', async (req,res) => {
    const {userId, tags} = req.body;
    try {
        const confirmedUser = await userService.changeTags(userId, userName);
        res.status(200).json(confirmedUser); 
    }catch(error){
        res.status(400).json({message: `Fail to change userName of ${userId}`})
    }
});

module.exports = router;