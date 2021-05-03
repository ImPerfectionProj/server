const express = require('express');
const router = express.Router();
const { v4: uuid } = require('uuid');
const UserModel = require('../models/user.schema');

const EventModel = require('../models/event.schema');

router.get('/event_posters', async (req, res) => {
    try{
        const allEvents = await EventModel.find();
        res.status(200).json({
            result_code: 140,
            message: "Successfully get all events.",
            events: allEvents}); 
    }catch(err){
        res.status(400).json({message: "MongoDB Connection Error"});
    }
})

router.post('/add_poster/:moderator_id', async (req, res) => {
    const {moderator_id} = req.params;
    const {title, description, pictureUrl, starttime, endtime} = req.body;
    
    try{
        const retrievedModerator = await UserModel.findOne({ userId: moderator_id, 
            role:"moderator" });
        if (!retrievedModerator){
            res.status(400).json({
                result_code: -12,
                message:"Moderator not found"})
        } else{
            const eventInstance = new EventModel({
                eventId: uuid(),
                moderatorId: moderator_id,
                title: title ,
                description: description,
                starttime: new Date(starttime),
                endtime: new Date(endtime),
                pictureUrl: pictureUrl
            })
            await eventInstance.save();
            res.status(200).json({
                result_code: 145,
                message: "Successfully add an event"}
                ); 
            
        };         
    }catch(err){
        console.log(err)
        res.status(200).json({
            result_code: 146,
            message: "Fail to add an event"});
    }
})

module.exports = router;