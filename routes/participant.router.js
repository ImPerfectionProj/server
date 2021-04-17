const express = require('express');
const router = express.Router();
// const participantService = require('../services/participant.service');
const roomService = require('../services/room.service');

router.post('/join', async (req,res) => {
    const {userId, roomId, anonymous} = req.body;
    console.log(userId);
    console.log(roomId);
    console.log(anonymous)
    // const isParticipant = moderatorService.verifyParticipant(userId);
    // if (isParticipant){
    try{
        const confirmedRoom = await roomService.joinRoom(roomId, userId,anonymous);
        res.status(200).json({
            roomId: confirmedRoom.roomId,
            name: confirmedRoom.name,
            topics: confirmedRoom.topics,
            description: confirmedRoom.description,
            moderators: confirmedRoom.moderators,
            participants: confirmedRoom.participants,
            active: confirmedRoom.active,
            starttime: confirmedRoom.starttime,
            endtime: confirmedRoom.endtime
          }); 
    } catch(err){
      console.log(err)
      res.status(400).json({message: `Fail to join into Room ${roomId}`})
    }
    
    // }else{
    //     res.status(400).json({
    //         message: "User does not have listener permission"
    //     });
    // }
  });



module.exports = router;