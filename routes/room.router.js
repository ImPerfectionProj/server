const express = require('express');
const router = express.Router();
const authService = require('../services/auth.service');
const userService = require('../services/user.service');
const RoomModel = require('../models/room.schema');
const userModel = require('../models/user.schema');
const roomService = require('../services/room.service');
const moderatorService = require('../services/moderator.service');


router.get('/all_active_rooms', async (req,res) => {
    // [nice to have] sort the rooms
    //  get all active rooms from the database
    const activeRooms = await RoomModel.find({ active: true });
    res.status(200).json({
        rooms: activeRooms
      }); 
});

router.get('/rooms_hosted_by_moderator/:moderator_userId', async (req,res) => {
  const { moderator_userId } = req.params;
  const moderatorInstance = await userModel.findOne({ userId: moderator_userId });
  res.status(200).json({
      moderator_userId,
      room_ids: moderatorInstance.hosted_rooms
    }); 
});

router.get('/:roomId/info', async (req,res) => {
  const { roomId } = req.params;
  const { userId } = req.body;
  const activeRooms = await RoomModel.findOne({ roomId });
  if (activeRooms && (activeRooms.moderators.includes(userId)||activeRooms.participants.includes(userId))){
    res.status(200).json({
      rooms: activeRooms
    }); 
  }else{
    res.status(200).json({
      message: "the user does not have the permission to view the room detial",
      num_participants: activeRooms.participants.length,
      num_moderators: activeRooms.moderators.length,
      name: activeRooms.name,
      topics: activeRooms.topics,
      description: activeRooms.description
    });
  }
  
});

router.patch('/:roomId/participant_list/:mute_uid/changeMuteStatus', async (req,res)=>{
  // update a participant's canSpeak attribute
  const { roomId, mute_uid } = req.params;
  const { hostId, canSpeak} = req.body;
  try{
      const retrievedRoom = await roomService.retrieve_With_RoomId_HostId(roomId, hostId);
      for (let i=0; i<retrievedRoom.participants.length; i++){
          if (retrievedRoom.participants[i].userId===mute_uid){
              retrievedRoom.participants[i].canSpeak = canSpeak;
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

router.patch('/:roomId/endRoom', async (req,res) => {
  const { roomId } = req.params;
  const { hostId } = req.body;

  try{
    
      const roomInstance = await roomService.endRoom(roomId, hostId);
      res.status(200).json(roomInstance); 
  }catch(e) {
      console.log(e);
      res.status(400).json({
          message: `Fail to end room with id ${roomId}`
      });
  }
});


// router.delete('/clear_room_participants/:roomId', async(req, res) =>{
//   const roomId = req.params.roomId;  
//   try{
//     const room= await RoomModel.findOne({roomId});
//     room.participants = [];
//     const result = await room.save();
//     res.status(200).json(result);
//     return result;
//   }catch(err){
//     console.log(err);
//     res.status(400).console("Cannot Clear Room")
//   }
// });

module.exports = router;
