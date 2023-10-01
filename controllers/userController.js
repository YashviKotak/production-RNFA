const { hashPassword, comparePassword } = require('../helpers/authHelper')
const userModel=require('../models/userModel')
const JWT=require('jsonwebtoken')
const expressJWT=require('express-jwt')
var { expressjwt: jwt } = require("express-jwt");

const requireSignIn=jwt(
    { secret:process.env.JWT_SECRET, algorithms: ["HS256"] }
)


const registerController=async(req,resp)=>{
 try {
    const {name,email,password}=req.body
    if(!name){
        return resp.status(400).send({
            success:false,
            message:'Name is required'
        })
    }
    if(!email){
        return resp.status(400).send({
            success:false,
            message:'email is required'
        })
    }
    if(!password || password.length < 6){
        return resp.status(400).send({
            success:false,
            message:'password is required and 6 character is long'
        })
    }
    const exisitingUser=await userModel.findOne({email})
    if(exisitingUser){
        return resp.status(500).send({
            success:false,
            message:'User Already Register With this Email'
        })
    }
    
    const hashedPassword=await hashPassword(password)
    
    const user=await userModel({name,email,password:hashedPassword}).save();
    return resp.status(201).send({
        success:true,
        message:'Registration Succesfull please login'
    })
 } catch (error) {
    console.log(error);
    return resp.status(500).send({
        success:false,
        message:"Error in Register API",
        error
    })
 }
}

const loginController=async(req,resp)=>{
   try {
    const {email,password}=req.body
    if(!email || !password){
        return resp.status(500).send({
            success:false,
            message:'Please Provide Email or Password'
        })
    }
    const user=await userModel.findOne({email})
    if(!user){
        return resp.status(500).send({
            success:false,
            message:'User not Found'
        })
    }
    const match=await comparePassword(password,user.password)
    if(!match){
        return resp.status(500).send({
            success:false,
            message:'Invalid username or password'
        })
    }

    const token=await JWT.sign({_id:user._id},process.env.JWT_SECRET,{
        expiresIn:'15d'
    })
    user.password=undefined
    resp.status(200).send({
        success:true,
        message:'Login Succesfully',
        token,
        user
      })
   } catch (error) {
    console.log(error);
    return resp.status(500).send({
        success:false,
        message:'Error in Login API',
        error
    })
   }
}

const updateUserController=async(req,resp)=>{
   try {
      const {name,password,email}=req.body 
      const user=await userModel.findOne({email})
      if(password && password.length < 6){
        resp.status(400).send({
            success:false,
            message:'Password is required and should be 6 character long'
        })
      }
      const hashedPassword=password ? await hashPassword(password) : undefined
      const updatedUser=await userModel.findOneAndUpdate({email},{
        name:name || user.name,
        password:hashedPassword || user.password
      },{new:true})
      resp.status(200).send({
        success:true,
        message:'Profile Updated Please Login',
        updatedUser
      })
      
   } catch (error) {
    console.log(error);
    resp.status(500).send({
        success:false,
        message:'Error In User Update Api',
        error
    })
   }
}

module.exports={registerController,loginController,updateUserController,requireSignIn}