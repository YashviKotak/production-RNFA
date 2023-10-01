const postModel = require("../models/postModel");

const createPostController=async(req,resp)=>{
   try {
      const {title,description}=req.body;
      if(!title || !description){
          return resp.status(500).send({
            success:false,
            message:'Please Provide all fields'
          })
      }
      const post=await postModel({
        title,
        description,
        postedBy:req.auth._id
      }).save()
      resp.status(201).send({
        success:true,
        message:'Post Created Successfully',
        post
      })
      console.log(req)
   } catch (error) {
    console.log(error)
    resp.status(500).send({
        success:false,
        message:'Error in Create Post API',
        error 
    })
   }
}

const getAllPostsController=async(req,resp)=>{
    try {
      const posts=await postModel.find().populate('postedBy','_id name')
      .sort({createdAt : -1});
      resp.status(200).send({
        success:true,
        message:'All Posts Data',
        posts
      })
    } catch (error) {
      console.log(error);
      resp.status(500).send({
        success:false,
        message:'Error in Get all Post API',
        error
      })
    } 
}

const getUserPostsController=async(req,resp)=>{
      try {
        const userPosts= await postModel.find({postedBy:req.auth._id})
        resp.status(200).send({
          success:true,
          message:'User Post',
          userPosts
        })
      } catch (error) {
        console.log(error);
        return resp.status(500).send({
          success:false,
          message:'Error in User Post API',
          error
        })
      }
}

const deletePostController=async(req,resp)=>{
    try {
      const {id}=req.params
      await postModel.findByIdAndDelete({_id:id})
      resp.status(200).send({
        success:true,
        message:'Your Post been Deleted',
      })
    } catch (error) {
      console.log(error);
      resp.status(500).send({
        success:false,
        message:'Error in delete Post API',
        error
      })
    }
}

const updatePostController=async(req,resp)=>{
  try {
    const {title,description}=req.body
    const post=await postModel.findById({_id:req.params.id})
    if(!title || !description){
      return resp.status(500).send({
        success:false,
        message:'Please provide post title or description',
      })
    }
    const updatedPost=await postModel.findByIdAndUpdate({_id:req.params.id},
      {
        title:title || post?.title,
        description:description || post?.description
      },{new:true})
      resp.status(200).send({
        success:true,
        message:'Post Updated Successfully',
        updatedPost
      })
  } catch (error) {
    console.log(error)
    resp.status(500).send({
      success:false,
      message:'Error in update Post API',
      error
    })
  }
}

module.exports={createPostController,getAllPostsController,getUserPostsController,deletePostController,updatePostController}