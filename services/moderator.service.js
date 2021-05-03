const UserModel = require('../models/user.schema');

const verifyIdentity = async (userId) => {
  const retrievedUser = await UserModel.findOne({userId, role:"moderator"});
  return retrievedUser;
};

// const verifyRoomOwnership = async (userId) => {
//   const retrievedUser = await UserModel.findOne({userId});
//   console.log(retrievedUser.role==="moderator")
//   return retrievedUser && retrievedUser.role==="moderator";
// };

module.exports = {
    verifyIdentity,
    // verifyRoomOwnership
};