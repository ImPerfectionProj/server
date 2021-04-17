const UserModel = require('../models/user.schema');

const verifyParticipant = async (userId) => {
  const retrievedUser = await UserModel.findOne({userId});
  console.log(retrievedUser.role!=="professional")
  return retrievedUser && retrievedUser.role!=="professional";
};


module.exports = {
    verifyParticipant
};