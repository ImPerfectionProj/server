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

module.exports = {

    createUser,
    retrieveWithEmailPassword,
  };