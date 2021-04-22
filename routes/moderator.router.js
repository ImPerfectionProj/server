const express = require('express');
const router = express.Router();
const moderatorService = require('../services/moderator.service');
const roomService = require('../services/room.service');


router.get('/host', async (req,res) => {
    const {userId, name, topics, description} = req.body;
    const isModerator = moderatorService.verifyIdentity(userId);
    if (isModerator){
        const newRoomInstance = await roomService.createRoom(userId, name, topics, description);
        
        res.status(200).json({
            roomId: newRoomInstance.roomId,
            name: newRoomInstance.name,
            topics: newRoomInstance.topics,
            description: newRoomInstance.description,
            moderators: newRoomInstance.moderators,
            active: newRoomInstance.active,
            starttime: newRoomInstance.starttime
          }); 
    }else{
        res.status(400).json({
            message: "User does not have room hosting permission"
        });
    }
});






router.post('', async (req,res)=>{});



module.exports = router;
