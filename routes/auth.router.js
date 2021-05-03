const express = require('express');
const router = express.Router();
const authService = require('../services/auth.service');
const userService = require('../services/user.service');
const UserModel = require('../models/user.schema');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
require('dotenv').config();


router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  console.log('signin with email');

  // fetch user
  const retrievedUser = await userService.retrieveWithEmailPassword(email, password);
  if (retrievedUser){
    res.status(200).json({
      result_code: 110,
      message: "User logged in successfully.",
      name: retrievedUser.name,
      profilePic: retrievedUser.profilePic,
      role: retrievedUser.role,
      userId: retrievedUser.userId
    });
  }else{
    res.status(400).json({
      result_code: -10,
      message: "User not found"
    });
  }
});

router.post('/signup', async (req,res) => {
  let { password, name, email, phoneNumber} = req.body;
  console.log('signup');
  
  try{
    const newUserInstance = await userService.createUser(password, name, email, phoneNumber);
    res.status(200).json({
      "result_code": 111,
      "message": "User signed up successfully",
      name: newUserInstance.name,
      email: newUserInstance.email,
      phoneNumber: newUserInstance.phoneNumber,
      userId: newUserInstance.userId
    });
  }catch (e){
    // if (e instanceof BadInputError){
    // } else if (e instanceof StatusCodeError){
    // }
    res.status(400).json({
      result_code: -11,
      message: "Sign up error"
    })
  }  
});



router.patch('/signup-addition', async (req, res) => {
  const { profilePic, mental_tags, custom_tags, userId } = req.body;
  console.log('adding avatar and tags');
  // fetch user
  const retrievedUser = await UserModel.findOne({userId});
  if (retrievedUser){
    if (profilePic){
      retrievedUser.profilePic = profilePic;
    }
    if (mental_tags){
      retrievedUser.mental_tags = mental_tags;
    }
    if (custom_tags){
      retrievedUser.custom_tags = custom_tags;
    }
    await retrievedUser.save();
    res.status(200).json({
      result_code : 112,
      message: "User tags and profile picture added.",
      userId: retrievedUser.userId,
      profilePic: retrievedUser.profilePic,
      mental_tags: retrievedUser.mental_tags,
      custom_tags: retrievedUser.custom_tags,
    });
  }else{
    res.status(400).json({
      result_code : -11,
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
      "result_code": 113,
      "message": "User password updated successfully."

    });
  }else{
    res.status(400).json({
      "result_code": -10,
      message: "User not found"
    })
  }
});

router.post('/forget_password', async (req, res) => {
  const { email} = req.body;
  // fetch user
  // try{
    const retrievedUser = await UserModel.findOne({email});
    if (retrievedUser){ 
      const reset_token = crypto.randomBytes(5).toString('hex');
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
      });
      
      var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'ImPerfection - Reset Password',
        text: `reset password token: ${reset_token}`
      };
      retrievedUser.pwd_token = reset_token;
      const confirmedUser = retrievedUser.save();
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.status(400).json({
            result_code: -20,
            message:`Fail to send to Email ${email}.`,
        reset_token:confirmedUser.pwd_token});
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).json({
            result_code: 120,
            message:"Reset token sent to Email Address."});
        }
      })
      
      
    } else {
      console.log("User not found with given email.")
      res.status(400).json({
        result_code: -10,
        message:"User not found."});
    }
  // } 
  // catch(err){
  //   console.log(err);
  //   res.status(400).json({message:'Cannot connect to MongoDB'});
  // }
});

router.patch('/forget_password/reset', async (req, res) => {
  const { email,reset_token,new_password} = req.body;
  // fetch user
  try{
    const retrievedUser = await UserModel.findOne({email});
    if (retrievedUser){ 
      const corr_reset_token = retrievedUser.pwd_token;
      if (corr_reset_token===reset_token){
        retrievedUser.pwd_token = '';
        retrievedUser.hash = crypto.pbkdf2Sync(new_password, retrievedUser.salt, 1212, 64, `sha512`)
        .toString(`hex`);
        await retrievedUser.save();
        res.status(200).json({
          result_code: 121,
          message:`Reset password successfully for user with email ${email}`
        });
      } else{
        res.status(200).json({
          result_code: 122,
          message:`Reset token is incorrect.`})
      }
  
    } else {
      console.log("Invalid Email Address.")
      res.status(400).json({
        result_code: -10,
        message:"User not found."});
    }
  } catch(err){
    console.log(err);
    res.status(200).json({
      result_code: 123,
      message:'Fail to reset password.'});
  }
});

router.patch('/changeRole', async (req,res) => {
  let { userId, newRole} = req.body;
  
  try{
    const newUserInstance = await userService.changeRole(userId, newRole);
    res.status(200).json({
      name: newUserInstance.name,
      userId: newUserInstance.userId,
      role: newUserInstance.role,
    });
  }catch (e){

    res.status(200).json({
      message: "Fail to change role"
    })
  }  
});


module.exports = router;
