const express = require('express');
const router = express.Router();
const authService = require('../services/auth.service');
const userService = require('../services/user.service');
const crypto = require('crypto');


router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  console.log('signin with email');

  // fetch user
  const retrievedUser = await userService.retrieveWithEmailPassword(email, password);
  if (retrievedUser){
    res.status(200).json({
      name: retrievedUser.name,
      profilePic: retrievedUser.profilePic,
      role: retrievedUser.role,
      userId: retrievedUser.userId
    });
  }else{
    res.status(400).json({
      message: "User not found"
    });
  }
});

router.post('/signup', async (req,res) => {
  let { password, name, email, phoneNumber} = req.body;
  
  try{
    const newUserInstance = await userService.createUser(password, name, email, phoneNumber);
    res.status(200).json({
      name: newUserInstance.name,
      email: newUserInstance.email,
      phoneNumber: newUserInstance.phoneNumber,
    });
  }catch (e){
    // if (e instanceof BadInputError){
    // } else if (e instanceof StatusCodeError){
    // }
    res.status(400).json({
      message: "signup error"
    })
  }  
});



router.patch('/signup-addition', async (req, res) => {
  const { profilePic, tags, email, password } = req.body;
  console.log('adding avatar and tags');
  // fetch user
  const retrievedUser = await userService.retrieveWithEmailPassword(email, password);
  if (retrievedUser){
    if (profilePic){
      retrievedUser.profilePic = profilePic;
    }
    if (tags){
      retrievedUser.tags = tags;
    }
    await retrievedUser.save();
    res.status(200).json({
      name: retrievedUser.name,
      profilePic: retrievedUser.profilePic,
      tags: retrievedUser.tags,
    });
  }else{
    res.status(400).json({
      message: "User not found"
    })
  }
});

router.patch('/reset_password/:userId', async (req, res) => {
  const { userId } = req.params;
  const { new_password, password } = req.body;
  // fetch user
  const retrievedUser = await userService.retrieveWithUserIdPassword(userId, password);
  if (retrievedUser){
    
    retrievedUser.hash = crypto.pbkdf2Sync(new_password, retrievedUser.salt, 1212, 64, `sha512`)
      .toString(`hex`);
    await retrievedUser.save();
    res.status(200).json({
      retrievedUser
    });
  }else{
    res.status(400).json({
      message: "User not found"
    })
  }
});

module.exports = router;
