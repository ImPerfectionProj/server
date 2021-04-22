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

const retrieveWithUserIdPassword = async (userId, password) => {
    const retrievedUser = await UserModel.findOne({userId});
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

const changeProfilePic = async( userId, profilePic) => {
    const retrievedUser = await UserModel.findOne({userId});
    if (!retrievedUser){
        return null;
    }
    retrievedUser.profilePic = profilePic;
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


const addFollow = async( userId, moderatorId) => {
    if (!await UserModel.findOne({userId})){
        throw Error(`User with ID ${userId} does not exist`);
    }
    if (!await UserModel.findOne({userId:moderatorId, role:"moderator"})){
        throw Error(`Moderator with ID ${moderatorId} does not exist`);
    }

    UserModel.updateOne({"userId":userId},
        {$addToSet: {following_list: moderatorId}}).catch((err) => {
            console.log('Error: ' + err);
        });;

    UserModel.updateOne({"userId":moderatorId},
        {$addToSet: {following_list: userId}}).catch((err) => {
            console.log('Error: ' + err);
        });;

    const updatedUser = await UserModel.findOne({userId});
    const updatedModerator  = await UserModel.findOne({userId:moderatorId});
    return {"follower":updatedUser, "moderator":updatedModerator};
}

const deleteFollow = async( userId, moderatorId) => {
    if (!await UserModel.findOne({userId})){
        throw Error(`User with ID ${userId} does not exist`);
    }
    if (!await UserModel.findOne({userId:moderatorId, role:"moderator"})){
        throw Error(`Moderator with ID ${moderatorId} does not exist`);
    }

    const retrievedUser = await UserModel.findOne({userId, 
        following_list:{$in :[moderatorId]}});
    const retrieveModerator = await UserModel.findOne({userId:moderatorId, 
        role:"moderator"});
    if (!retrievedUser){
        console.log(`User with ID ${userId} is not following Moderator ${userId}`);
        return {"follower":retrievedUser, "moderator":retrieveModerator};   
    }
    UserModel.updateOne({userId},
        {$pull: {following_list: moderatorId}}).
        catch((err) => {
            console.log('Error: ' + err);
        });;
    
    UserModel.updateOne({userId:moderatorId},
        {$pull: {following_list: userId}}).
        catch((err) => {
            console.log('Error: ' + err);
        });;

    const updatedUser = await UserModel.findOne({userId});
    const updatedModerator  = await UserModel.findOne({userId:moderatorId});
    return {"follower":updatedUser, "moderator":updatedModerator};
}

const applyForModerator = async(userId) => {
    return null;
}



module.exports = {
    createUser,
    retrieveWithEmailPassword,
    retrieveWithUserIdPassword,
    resetPassword,
    changeUsername,
    changeTags,
    changeProfilePic,
    changeEmail,
    changePhoneNumber,
    changeDescription,
    addFollow,
    deleteFollow,
    applyForModerator

  };


