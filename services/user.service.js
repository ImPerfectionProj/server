const UserModel = require('../models/user.schema');
const { v4: uuid } = require('uuid');

const createUser = async (password, name, email, phoneNumber) => {
    if (!password || !name || !email || !phoneNumber){
        console.log(password, name, email, phoneNumber);
        throw new BadInputError(`missing parameters: ${password} ${name} ${email} ${phoneNumber}`);
    }

    const checkDup = await UserModel.findOne({ email });
    if (checkDup){
        throw new StatusCodeError(400, 'User already has an account');
    }

    const userInstance = new UserModel({
        userId: uuid(),
        name, 
        email,
        phoneNumber
    });

    userInstance.setPassword(password);
    const confirmedUser = await userInstance.save();
    return confirmedUser;

};

const retrieveWithEmailPassword = async (email, password) => {
    const retrievedUser = await UserModel.findOne({email});
    if (!retrievedUser || !retrievedUser.validPassword(password) ){
        return null;
    }
    return retrievedUser;
};

const resetPassword = async(userId, password) => {
    const retrievedUser = await UserModel.findOne({userId});
    if (!retrievedUser){
        return null;
    }
    retrievedUser.setPassword(password);
    const confirmedUser = await retrievedUser.save();
    return confirmedUser;
}

const changeUsername = async( userId, userName) => {
    const retrievedUser = await UserModel.findOne({userId});
    if (!retrievedUser){
        return null;
    }
    retrievedUser.name = userName;
    const confirmedUser = await retrievedUser.save();
    return confirmedUser;
}

const changeTags = async( userId, tags) => {
    const retrievedUser = await UserModel.findOne({userId});
    if (!retrievedUser){
        return null;
    }
    retrievedUser.tags = tags;
    const confirmedUser = await retrievedUser.save();
    return confirmedUser;
}

const changeProfileUrl = async( userId, profileUrl) => {
    const retrievedUser = await UserModel.findOne({userId});
    if (!retrievedUser){
        return null;
    }
    retrievedUser.profileUrl = profileUrl;
    const confirmedUser = await retrievedUser.save();
    return confirmedUser;
}

const changeEmail = async( userId, email) => {
    const retrievedUser = await UserModel.findOne({userId});
    if (!retrievedUser){
        return null;
    }
    retrievedUser.email = email;
    const confirmedUser = await retrievedUser.save();
    return confirmedUser;
}

const changePhoneNumber = async( userId, phoneNumber) => {
    const retrievedUser = await UserModel.findOne({userId});
    if (!retrievedUser){
        return null;
    }
    retrievedUser.phoneNumber = phoneNumber;
    const confirmedUser = await retrievedUser.save();
    return confirmedUser;
}

const changeDescription = async( userId, description) => {
    const retrievedUser = await UserModel.findOne({userId});
    if (!retrievedUser){
        return null;
    }
    retrievedUser.description = description;
    const confirmedUser = await retrievedUser.save();
    return confirmedUser;
}

const deleteFollowModerator = async(moderatorId, followerId) => {
    const retrieveModerator = await UserModel.findOne({userId:moderatorId, 
        following_list:{$nin :[followerId]}});
    if (!retrieveModerator){
        return null;
    } 
    UserModel.update({userId:moderatorId},
        {$pull: {following_list: {$nin :[followerId]}}});

    return await UserModel.findOne({userId:moderatorId, 
        following_list});
}
const addFollowModerator = async(moderatorId, followerId) => {
    const retrieveModerator = await UserModel.findOne({userId:moderatorId, 
        following_list:{$nin :[followerId]}});
    if (!retrieveModerator){
        return null;
    } 
    UserModel.update({userId:moderatorId},
        {$push: {following_list: {$addToSet :[followerId]}}});

    return await UserModel.findOne({userId:moderatorId, 
        following_list});
}

const addFollow = async( userId, follows) => {
    const retrievedUser = await UserModel.findOne({userId});
    if (!retrievedUser){
        return null;
    }
    UserModel.update({userId:userId},
        {following_list: {$addtoSet: [follows]}});
    for (f in follows){
        addFollowModerator(f, userId);
    }

    return await UserModel.findOne({userId});
}

const deleteFollow = async( userId, follows) => {
    const retrievedUser = await UserModel.findOne({userId});
    if (!retrievedUser){
        return null;
    }
    retrievedUser.tags = tags;
    for (f in follows){
        deleteFollowModerator(f, userId);
    }

    return await UserModel.findOne({userId});
}

const applyForModerator = async(userId) => {
    return null;
}



module.exports = {
    createUser,
    retrieveWithEmailPassword,
    resetPassword,
    changeUsername,
    changeTags,
    changeProfileUrl,
    changeEmail,
    changePhoneNumber,
    changeDescription,
    addFollow,
    deleteFollow,
    applyForModerator

  };


