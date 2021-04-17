const mongoose = require('mongoose');
const crypto = require('crypto');

const chatroomSchema = new mongoose.Schema(
    {
      roomId: String,
      name: String,
      topics: [String],
      description: String,
      moderators: [String],
      participants: [],
      active: { type : Boolean, default: true },
      starttime: { type : Date, default: Date.now },
      endtime: Date
    },
    { timestamps: true },
);



const chatroomModel = mongoose.model('chatroom', chatroomSchema);
module.exports = chatroomModel;
