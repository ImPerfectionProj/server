const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');
const UserModel = require('../models/user.schema');

router.get('/all_users', async (req,res) => {
    try{
        const allUsers = await UserModel.find();
    res.status(200).json({
        result_code: 150,
        message: "Successfully get all users.",
        users: allUsers
      });
    } catch(err){
        console.log(err.message);
        res.status(400).json({
            result_code: 151,
            message: "Fail to get all users.",
        })
    }  
});

router.get('/:userId', async (req,res) => {
    const {userId} = req.params;
    console.log(userId);
    try{
        const user = await UserModel.findOne({userId});
        if (user){
            res.status(200).json({
                result_code: 152,
                message: "Successfully get profile information of userId.",
                user

            });
        }
        else{
            res.status(400).json({
                result_code: -10,
                message: "User not found",
        })
        }
        
    } catch(error){
        console.log(error.message);
        res.status(400).json({
            result_code: 151,
            message: "Fail to get user w/ userId.",
        })
    }  
});

router.patch('/:userId/profile', async (req,res) => {
    console.log("update profile")
    const {userId} = req.params;
    const {username, email,phoneNumber,profilePic,description,
        mental_tags,custom_tags,linkedIn} = req.body;
    try{ 
        const userInstance = await UserModel.findOne({ userId:userId });
        if (!userInstance){res.status(400).json({
            result_code : -10,
            message: "User not found"
        });} else{
        if (username){userInstance.username = username;}
        if (email){userInstance.email = email;}
        if (phoneNumber){userInstance.phoneNumber = phoneNumber;}
        if (profilePic){userInstance.profilePic = profilePic;}
        if (description){userInstance.description = description;}
        if (mental_tags){userInstance.mental_tags = mental_tags;}
        if (mental_tags){userInstance.mental_tags = mental_tags;}
        if (custom_tags){userInstance.custom_tags = custom_tags;}
        if (linkedIn){userInstance.linkedIn = linkedIn;}
        await userInstance.save();
        res.status(200).json({
            result_code: 153,
            message: "Successfully update the profile."
        })}
    }
    catch(err){
        console.log(err.message);
        res.status(200).json({
            result_code: 154,
            message: "Fail to update the profile."
        })
    }
})

router.get('/:userId/followers', async (req,res) => {
    const { userId } = req.params;
    try{
        const userInstance = await UserModel.findOne({ userId });
        if (userInstance){
            res.status(200).json({
                result_code: 160,
                message: "Successfully get the follower/following list.",
                follower_list: userInstance.follower_list
            }); 
        }else{
            res.status(400).json({
                result_code : -10,
                message: "user not found"
            }); 
        }
    }catch(err){
        console.log(err);
        res.status(200).json({
            result_code: 161,
            message: "Fail to get the follower/following list"
        }); 
    }
    
    
});

router.patch('/:userId/follow/:follow_userId', async (req,res) => {
    // TODO: need token verification later
    const { userId, follow_userId } = req.params;
    try{ 
    const userInstance = await UserModel.findOne({ userId });
    const follow_userInstance = await UserModel.findOne({ userId: follow_userId });
    if (userInstance && follow_userInstance){
        if (!userInstance.following_list.includes(follow_userId)){
            userInstance.following_list.push(follow_userId);
        }
        if (!follow_userInstance.follower_list.includes(userId)){
            follow_userInstance.follower_list.push(userId);
        }
        await userInstance.save();
        await follow_userInstance.save();
            
        res.status(200).json({
            result_code: 162,
            message: "Successfully add a following & follower."
          }); 
    }else{
        console.log(userInstance)
        console.log(follow_userInstance)
        res.status(400).json({
            result_code: -10,
            message: "User not found"
          }); 
    }}catch(err){
        console.log(err.message);
        res.status(200).json({
            result_code: 163,
            message: "Fail to add a following & follower."
        })
    }
    
});

router.patch('/:userId/unfollow/:follow_userId', async (req,res) => {
    // TODO: need token verification later
    const { userId, follow_userId } = req.params;
    try{ 
    const userInstance = await UserModel.findOne({ userId });
    const follow_userInstance = await UserModel.findOne({ userId: follow_userId });
    if (userInstance && follow_userInstance){
        const following_index = userInstance.following_list.indexOf(follow_userId);
        if (following_index>-1){
            userInstance.following_list.splice(following_index,1);
        }
        const follower_index = follow_userInstance.follower_list.indexOf(userId)
        if (follower_index>-1){
            follow_userInstance.follower_list.splice(follower_index,1);
        }
        await userInstance.save();
        await follow_userInstance.save();
        res.status(200).json({
            result_code: 157,
            message: "Successfully unfollow a following & follower."
          }); 
    }else{
        console.log(userInstance)
        console.log(follow_userInstance)
        res.status(400).json({
            result_code: -10,
            message: "User not found"
          }); 
    }}catch(err){
        console.log(err.message);
        res.status(200).json({
            result_code: 158,
            message: "Fail to add a following & follower."
        })
    }
    
});

router.get('/avatar/:userId', async (req, res) => {
    const { userId } = req.params;
    const avatar = await userService.getAvatar(userId)
    if (avatar) {
      // res.type(avatar.mimetype);
      res.status(200).json({
        "result_code": 170,
        avatar: avatar
      });
    } else {
      res.status(400).json({
        result_code: -40,
        message: "Get avatar failure"
      })
    }
});

router.post('/avatar/:userId', async (req,res) => {
    // upload avatar
    // console.log(req.files)
    if (!req.files){
        res.status(400).json({
            result_code: -9,
            message: "Image file not uploaded"
        })
    } else {
        try{
            const {userId} = req.params;
            const avatar = req.files.avatar;
            const userInstance = await userService.uploadAvatar(userId, avatar);
            res.status(200).json({
                "result_code": 155,
                "message": "User uploaded avatar successfully",
                userId,
                avatarName: userInstance.avatar.name,
                mimetype: userInstance.avatar.mimetype
            });
        } catch (e) {
            res.status(400).json({
                result_code: -10,
                message: "User not found"
            })
        }  
    }    
});

module.exports = router;