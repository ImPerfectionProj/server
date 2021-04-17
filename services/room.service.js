const UserModel = require('../models/user.schema');
const RoomModel = require('../models/room.schema');
const { v4: uuid } = require('uuid');


const createRoom = async (userId, name, topics, description) => {
    // create room instance
    // add roomId to host(userId)'s hosted_rooms

    if (!userId || !name ){
        console.log(userId, name, topics, description);
        throw new BadInputError(`missing parameters: ${userId} ${name} ${topics} ${description}`);
    }

    // console.log("here")

    const roomInstance = new RoomModel({
        roomId: uuid(),
        name, 
        topics,
        description,
        moderators: [userId],
        participants: []
    });
    const confirmdRoom = await roomInstance.save();
    return confirmdRoom;
};

const retrieve_With_RoomId_HostId = async (roomId, hostId) => {
    // retrieve roomInstance
    // check if the user 
    const retrievedChatroom = await RoomModel.findOne({roomId});
    if (!retrievedChatroom || !retrievedChatroom.moderators.includes(hostId)){
        return null;
    }
    return retrievedChatroom;
};

module.exports = {
    createRoom,
    retrieve_With_RoomId_HostId,
  };