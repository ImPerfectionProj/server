const express = require('express');
const router = express.Router();
const authService = require('../services/auth.service');
const userService = require('../services/user.service');


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
    });
  }else{
    res.status(400).json({
      message: "User not found"
    })
  }
});

router.post('/signup', async (req,res) => {
  let { password, name, email, phoneNumber, role, description, tags, profilePic } = req.body;
  role = role==null ? 'student' : role;
  
  try{
    const newUserInstance = await userService.createUser(password, name, email, phoneNumber, role, description, tags, profilePic);
    res.status(200).json({
      name: newUserInstance.name,
      profilePic: newUserInstance.profilePic,
      role: newUserInstance.role,
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

module.exports = router;
