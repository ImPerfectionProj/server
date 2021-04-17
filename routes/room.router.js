const express = require('express');
const router = express.Router();
const authService = require('../services/auth.service');
const userService = require('../services/user.service');
const RoomModel = require('../models/room.schema');

router.get('/all_active_rooms', async (req,res) => {
    // [nice to have] sort the rooms
    //  get all active rooms from the database
    const activeRooms = await RoomModel.find({ active: true });
    res.status(200).json({
        rooms: activeRooms
      }); 
});

router.delete('/clear_room_participants/:roomId', async(req, res) =>{
  const roomId = req.params.roomId;  
  try{
    const room= await RoomModel.findOne({roomId});
    room.participants = [];
    const result = await room.save();
    res.status(200).json(result);
    return result;
  }catch(err){
    console.log(err);
    res.status(400).console("Cannot Clear Room")
  }
});

module.exports = router;
