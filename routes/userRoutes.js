const express=require('express')
const { registerController, loginController, updateUserController, requireSignIn } = require('../controllers/userController')
const multer = require("multer")();

const router=express.Router()

router.post('/register',multer.any(),registerController)
router.post('/login',multer.any(),loginController)
router.put('/update-user',requireSignIn,updateUserController)

module.exports=router;