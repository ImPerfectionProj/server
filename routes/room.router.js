const express = require('express');
const router = express.Router();
const authService = require('../services/auth.service');
const userService = require('../services/user.service');
const RoomModel = require('../models/room.schema');
const userModel = require('../models/user.schema');
const roomService = require('../services/room.service');
const moderatorService = require('../services/moderator.service');

router.post('/create/:moderator_id', async (req,res) => {
  console.log("create room");
  const {moderator_id} = req.params;
  const {name, topics, description} = req.body;
  const moderator = await userModel.findOne({userId: moderator_id, role:"moderator"});
  if (moderator){
    try{
      const newRoomInstance = await roomService.createRoom(moderator_id, moderator.name, name, topics, description);
      
      // console.log(moderator.hosted_rooms);
      if (moderator.hosted_rooms){
        moderator.hosted_rooms.push(newRoomInstance.roomId);
      } else{
        moderator.hosted_rooms = [newRoomInstance.roomId];
      }
      await moderator.save();
      res.status(200).json({
        result_code: 210,
        message: "Successfully create a chat room by moderator.",
        room: newRoomInstance});
    } catch(err){
      console.log(err.message);
      res.status(400).json({
        result_code: 211,
        message: `Moderator fails to create a chat room`
    });
    }

  }else{
      res.status(400).json({
        result_code: -20,
        message: "User does not have room hosting permission"
      });
  }
});

router.get('/all_active_rooms', async (req,res) => {
    // [nice to have] sort the rooms
    //  get all active rooms from the database
    try{
      const activeRooms = await RoomModel.find({ active: true });
      res.status(200).json({
        result_code : 200,
        message: "Successfully retrieve active chat room list successfully.",
        rooms: activeRooms
      }); 
    }catch(err){
      console.log(err.message);
      res.status(200).json({
        result_code : 201,
        message: "Fail to retrieve active chat room."
      });
    }
});

router.get('/rooms_hosted_by_moderator/:moderator_userId', async (req,res) => {
  const { moderator_userId } = req.params;
  try{
    const moderatorInstance = await userModel.findOne({ userId: moderator_userId, role:"moderator" });
    if (moderatorInstance){
      const hosted_rooms = moderatorInstance.hosted_rooms;
      res.status(200).json({
        result_code: 215,
        message:  "Successfully get all chat rooms hosted by moderator.",
        moderatorId:  moderator_userId,
        room_ids: hosted_rooms
      }); 
    }
    else{
      res.status(400).json({
        result_code: -20,
        message:  "User does not have room hosting permission."
        }); 
    }
  
  } catch(err){
    console.log(err.message);
    res.status(200).json({
      result_code: 216,
      message:  "Fail to get all chat rooms hosted by moderator."
      }); 
  }
  
});

router.get('/:roomId/info', async (req,res) => {
  const { roomId } = req.params;
  const { userId } = req.body;
  try{
  const activeRooms = await RoomModel.findOne({ roomId });
  if (activeRooms && activeRooms.active && (activeRooms.moderators.includes(userId)||activeRooms.participants.includes(userId))){
    res.status(200).json({
      result_code: 220,
      message: "Successfully view the room detail.",
      room: activeRooms
    }); 
  }else if (activeRooms){
    res.status(200).json({
      result_code: 221,
      message: "User does not have the permission to view the room detail",
      num_participants: activeRooms.participants.length,
      moderator_ids: activeRooms.moderators,
      name: activeRooms.name,
      topics: activeRooms.topics,
      description: activeRooms.description,
      historical_max: activeRooms.historical_max
    });
  } else{
    res.status(400).json({
      result_code: -30,
      message: "Not found roomId"
    })
  }
} catch(err){
  console.log(err.message);
  res.status(200).json({
    result_code: 222,
    message: "Fail to view room detail"
  })
}
  
});

router.patch('/:roomId/participant_list/:mute_uid/changeMuteStatus', async (req,res)=>{
  // update a participant's canSpeak attribute
  const { roomId, mute_uid } = req.params;
  const { hostId, canSpeak} = req.body;
  try{
      const retrievedRoom = await roomService.retrieve_With_RoomId_HostId(roomId, hostId);
      if (!retrievedRoom){res.status(400).json({
        result_code: -31,
        message: "User does not have change mute status permission"
        }); }
      for (let i=0; i<retrievedRoom.participants.length; i++){
          if (retrievedRoom.participants[i].userId===mute_uid){
              retrievedRoom.participants[i].canSpeak = canSpeak;
          }
      }
      const confirmedRoom = await retrievedRoom.save();
      res.status(200).json({
        result_code: 230,
        message: "Successfully change the mute status of a listener."
        }); 
  }catch (e) {
      console.log(e);
      res.status(200).json({
        result_code: 231,
        message: "Fail to change the mute status of the listener"
      });
  }
});

router.patch('/:roomId/endRoom', async (req,res) => {
  const { roomId } = req.params;
  const { hostId } = req.body;
  try{
      await roomService.endRoom(roomId, hostId);
      res.status(200).json({
        result_code: 240,
        message: "Successfully end the room."}); 
  }catch(err) {
    console.log(err.message);
    if (err.message==="-32"){res.status(400).json({
      result_code: -32,
      message:"User does not have end room permission."})}
    if (err.message==="-30"){res.status(400).json({
      result_code: -30,
      message:"Not found roomId."})}
    
    res.status(200).json({
        result_code: 241,
        message: "Fail to end the room."
    });
  }
});

router.patch('/:roomId/participant_list/:new_user_id/joinAnonymous', async (req,res) => {
  const { roomId, new_user_id, } = req.params;
  const anonymous = true;
  try{
      const confirmedRoom = await roomService.joinRoom(roomId, new_user_id,anonymous);
      res.status(200).json({
        result_code: 250,
        message: "Successfully join the room."
        }); 
  } catch(err){
    console.log(err.message)
    if (err.message==="-33"){res.status(400).json({
      result_code: -33,
      message:"The moderator cannot join chat rooms as a listener."})}
    if (err.message==="-30"){res.status(400).json({
      result_code: -30,
      message:"Not found roomId."})}
    if (err.message==="-10"){res.status(400).json({
      result_code: -10,
      message:"User not found"})}
    
    res.status(200).json({
        result_code: 251,
        message: "Fail to join the room."
    });
  }
});

router.patch('/:roomId/participant_list/:new_user_id/join', async (req,res) => {
  const { roomId, new_user_id, } = req.params;
  const anonymous = false;
  try{
      const confirmedRoom = await roomService.joinRoom(roomId, new_user_id,anonymous);
      res.status(200).json({
          roomId: confirmedRoom.roomId,
          participants: confirmedRoom.participants,
          active: confirmedRoom.active,
          starttime: confirmedRoom.starttime
        }); 
  } catch(err){
    console.log(err.message)
    if (err.message==="-33"){res.status(400).json({
      result_code: -33,
      message:"The moderator cannot join chat rooms as a listener."})}
    if (err.message==="-30"){res.status(400).json({
      result_code: -30,
      message:"Not found roomId."})}
    if (err.message==="-10"){res.status(400).json({
      result_code: -10,
      message:"User not found"})}
    
    res.status(200).json({
        result_code: 251,
        message: "Fail to join the room."
    });
  }
});

router.patch('/:roomId/participant_list/:new_user_id/leave', async (req,res) => {
  const { roomId, new_user_id} = req.params;
  try{
      const confirmedRoom = await roomService.leaveRoom(roomId, new_user_id);
      res.status(200).json({
        result_code: 255,
        message:"Successfully leave the room."
        }); 
  } catch(err){
    console.log(err.message)
    if (err.message==="-30"){res.status(400).json({
      result_code: -30,
      message:"Not found roomId."})}
    if (err.message==="-10"){res.status(400).json({
      result_code: -10,
      message:"User not found"})}
    
    res.status(200).json({
        result_code: 256,
        message: "Fail to leave the room."
    });
  }

});
router.patch('/:roomId/remove', async (req,res) => {
  const { moderator_id, participant_id} = req.body;
  try{
      await roomService.remove_participant_by_host(roomId, moderator_id,
        participant_id);
      res.status(200).json({
        result_code: 257,
        message:"Successfully remove the listener from the room."
        }); 
  } catch(err){
    console.log(err.message)
    if (err.message==="-35"){res.status(400).json({
      result_code: -35,
      message:"Room is inactive."})}
    if (err.message==="-30"){res.status(400).json({
      result_code: -30,
      message:"Not found roomId."})}
    if (err.message==="-10"){res.status(400).json({
      result_code: -10,
      message:"User not found"})}
    
    res.status(200).json({
        result_code: 258,
        message: "Fail to remove the listener from  the room."
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
