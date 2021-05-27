const UserModel = require('../models/user.schema');
const RoomModel = require('../models/room.schema');
const { v4: uuid } = require('uuid');


const createRoom = async (userId, moderatorName, name, topics, description) => {
    // create room instance
    // add roomId to host(userId)'s hosted_rooms

    if (!userId || !name ){
        console.log(userId, name, topics, description);
        throw new BadInputError(`missing parameters: ${userId} ${name} ${topics} ${description}`);
    }

    // console.log("here")

    const roomInstance = new RoomModel({
        roomId: uuid().substring(0,6),
        name, 
        topics,
        description,
        moderators: [{userId, moderatorName}],
        participants: []
    });
    const confirmdRoom = await roomInstance.save();
    return confirmdRoom;
};

const endRoom = async(roomId, hostId) =>{
    const retrievedChatroom = await RoomModel.findOne({roomId});

    const findHost = (uId, roomIns) => {
        for (let i=0; i<roomIns.moderators.length; i++){
            if (roomIns.moderators[i].userId===uId){
                return true;
            }
        }
        return false;
    } 

    console.log(roomId)
    console.log(retrievedChatroom.moderators.includes({userId: hostId}))
    // if (retrievedChatroom && retrievedChatroom.moderators.includes({userId: hostId})){
    if (retrievedChatroom && findHost(hostId, retrievedChatroom)) {
        if (retrievedChatroom.active){
            retrievedChatroom.endtime = Date.now() ;
            retrievedChatroom.active = false;
            const confirmdRoom = await retrievedChatroom.save();
            return confirmdRoom;
        } else {
            console.log('Room with ID ${roomId} has already been ended')
            return retrievedChatroom;
            // throw new  BadInputError(`Room with ID ${roomId} has already been ended`);
        }
    } else if (!retrievedChatroom.moderators.includes({userId: hostId})){
        throw new Error(`-32`);
    }
    else{
        throw new Error(`-30`);
    }
}



const joinRoom = async (roomId, userId, anonymous) => {
    const retrievedChatroom = await RoomModel.findOne({roomId});
    if (!retrievedChatroom || ! retrievedChatroom.active){
        throw new Error(`-30`);
    }
    const retrievedUser = await UserModel.findOne({userId});
    if (!retrievedUser){
        throw new Error(`-10`);
    } else if (retrievedUser.role === "moderator"){
        throw new Error(`-33`);
    }

    if (retrievedChatroom.participants.map(a=>a.userId).includes(userId)){
        console.log(`User with ID ${userId} already joined room `);
        return retrievedChatroom;
    }
    retrievedChatroom.participants.push({"userId":userId, 
                                        "anonymous":anonymous,
                                        "canSpeak":false})
    if (retrievedChatroom.participants.length > retrievedChatroom.historical_max){
        retrievedChatroom.historical_max=retrievedChatroom.participants.length;
    }

    const confirmdRoom = await retrievedChatroom.save(); //RoomModel.findOne({roomId});
    return confirmdRoom
  };


const leaveRoom = async (roomId, userId) => {
    const retrievedChatroom = await RoomModel.findOne({roomId});
    if (!retrievedChatroom || ! retrievedChatroom.active){
        throw new Error(`-30`);
    }
    const retrievedUser = await UserModel.findOne({userId});
    if (!retrievedUser){
        throw new Error(`-10`);
    } 

    const index = retrievedChatroom.participants.map(a=>a.userId).indexIf(userId);

    if (index>=-1){
        retrievedChatroom.participants.splice(index, 1);       
    }

    const confirmdRoom = await retrievedChatroom.save(); //RoomModel.findOne({roomId});
    return confirmdRoom
  };
  
  const remove_participant_by_host = async (roomId, hostId, userId) => {
    const retrievedChatroom = await RoomModel.findOne({roomId, moderators: { "$in" : [hostId]}});
    if (!retrievedChatroom ){
        throw new Error(`-30`);
    }
    if (!retrievedChatroom.active){
        throw new Error(`-35`);
    }
    
    
    const retrievedUser = await UserModel.findOne({userId});
    if (!retrievedUser){
        throw new Error(`-10`);
    } 

    const index = retrievedChatroom.participants.map(a=>a.userId).indexIf(userId);

    if (index>=-1){
        retrievedChatroom.participants.splice(index, 1);       
    }

    const confirmdRoom = await retrievedChatroom.save(); //RoomModel.findOne({roomId});
    return confirmdRoom
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

const retrievedRooms = async (hosted_rooms) => {
    // retrieve roomInstance
    // check if the user 
    const rooms = await RoomModel.find({roomId: {$in: hosted_rooms}});
    if (!rooms){
        return [];
    }
    return rooms;
};



module.exports = {
    createRoom,
    endRoom,
    retrieve_With_RoomId_HostId,
    joinRoom,
    leaveRoom,
    remove_participant_by_host,
    retrievedRooms
  };