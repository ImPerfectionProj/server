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

const endRoom = async(roomId) =>{
    const retrievedChatroom = await RoomModel.findOne({roomId});
    if (retrievedChatroom){
        if (retrievedChatroom.active){
        retrievedChatroom.endtime = Date.now ;
        retrievedChatroom.active = false;
        const confirmdRoom = await retrievedChatroom.save();
        return confirmdRoom;
        } else {
            return retrievedChatroom;
            // throw new  BadInputError(`Room with ID ${roomId} has already been ended`);
        }
    } else{
        throw new BadInputError(`Room with ID ${roomId} does not exist`);
    }
}

const retrieve_With_RoomId_HostId = async (roomId, hostId) => {
    // retrieve roomInstance
    // check if the user 
    const retrievedChatroom = await RoomModel.findOne({roomId});
    if (!retrievedChatroom || !retrievedChatroom.moderators.includes(hostId)){
        return null;
    }
    return retrievedChatroom;
};


const joinRoom = async (roomId, userid, anonymous) => {
    // retrieve roomInstance
    // check if the user 
    const retrievedChatroom = await RoomModel.findOne({roomId});
    if (retrievedChatroom && retrievedChatroom.active){
        retrievedChatroom.participants.update({userid: uid}, 
            { userid:uid, anonymous:isanonymous,canSpeak:false}, 
            { upsert : true }, callback);
        console.log(retrievedChatroom.participants.findOne({userid:userid}));
        const confirmdRoom = await retrievedChatroom.save();
        return confirmdRoom
    } else{
        throw new BadInputError(`Room with ID ${roomId} does not exist`);
    }
    
  };
  



module.exports = {
    createRoom,
    endRoom,
    retrieve_With_RoomId_HostId,
    joinRoom

  };