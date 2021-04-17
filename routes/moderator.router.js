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

router.post('/endRoom/:roomId', async (req,res) => {
    const roomId = req.params.roomId;

    try{
        const newRoomInstance = await roomService.endRoom(roomId);
        res.status(200).json(newRoomInstance); 
    }catch(e) {
        console.log(e);
        res.status(400).json({
            message: `Fail to end room with id ${roomId}`
        });
    }
});

router.post('/changeMuteStatus/:mute_uid', async (req,res)=>{
    const mute_uid = req.params.mute_uid;
    const {roomId, hostId, mute} = req.body;
    try{
        const retrievedRoom = await roomService.retrieve_With_RoomId_HostId(roomId, hostId);
        for (let i=0; i<retrievedRoom.participants.length; i++){
            if (retrievedRoom.participants[i].userId===mute_uid){
                retrievedRoom.participants[i].canSpeak = !mute;
            }
        }
        const confirmedRoom = await retrievedRoom.save();
        res.status(200).json({
            roomId: confirmedRoom.roomId,
            name: confirmedRoom.name,
            topics: confirmedRoom.topics,
            description: confirmedRoom.description,
            moderators: confirmedRoom.moderators,
            participants: confirmedRoom.participants,
            active: confirmedRoom.active,
            starttime: confirmedRoom.starttime
          }); 
    }catch (e) {
        console.log(e);
        res.status(400).json({
            message: "cannot mute the user"
        });
    }
});



router.post('', async (req,res)=>{});



module.exports = router;
