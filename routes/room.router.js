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



module.exports = router;
