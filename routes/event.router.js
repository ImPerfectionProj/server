const express = require('express');
const router = express.Router();
const { v4: uuid } = require('uuid');
const UserModel = require('../models/user.schema');

const EventModel = require('../models/event.schema');

router.get('/event_posters', async (req, res) => {
    try{
        const allEvents = await EventModel.find();
        res.status(200).json(allEvents); 
    }catch(err){
        res.status(400).json({message: "MongoDB Connection Error"});
    }
})

router.post('/add_poster/:moderator_id', async (req, res) => {
    const {moderator_id} = req.params;
    const {title, pictureUrl} = req.body;
    
    try{
        const retrievedModerator = await UserModel.findOne({ userId: moderator_id, 
            role:"moderator" });
        if (!retrievedModerator){
            res.status(200).json({message:"Not existing moderator"})
        } else{
        const eventInstance = new EventModel({
            eventId: uuid(),
            moderatorId: moderator_id,
            title: title ,
            pictureUrl:pictureUrl
        });
        const confirmedEvent = await eventInstance.save();
        res.status(200).json(confirmedEvent); }
        
    }catch(err){
        console.log(err)
        res.status(400).json({message: "MongoDB Connection Error"});
    }
})

module.exports = router;