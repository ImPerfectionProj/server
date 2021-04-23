const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
    {
      userId: String,
      name: String,
      email: String,
      phoneNumber: String,
      role: String,
      profilePic: String,
      salt: String,
      description: String,
      hash: String, // salted password
      following_list: { type : [String], default: [] }, // users who the user follows to
      follower_list: { type : [String], default: [] }, // user's follower
      tags: [String], // string of tag names
      hosted_rooms: [String], // string of chatroomId,
      pwd_token: String
    },
    { timestamps: true },
);

// Method to set salt and hash the password for a user
userSchema.methods.setPassword = function (password) {
// Creating a unique salt for a particular user
    this.salt = crypto.randomBytes(16).toString('hex');

    this.hash = crypto
        .pbkdf2Sync(password, this.salt, 1212, 64, `sha512`)
        .toString(`hex`);
    };

// Method to check the entered password is correct or not
userSchema.methods.validPassword = function (password) {
    var hash = crypto
      .pbkdf2Sync(password, this.salt, 1212, 64, `sha512`)
      .toString(`hex`);
    return this.hash === hash;
  };

  
const userModel = mongoose.model('user', userSchema);
module.exports = userModel;
