const  mongoose = require("mongoose")
const  { User } = require( "../Models/index.js")

  const OtpHandler = (req,res,next)=>{
      const {user} = req.user
      
      if(user.status==="Active"){
        return next()
      }

      else{
        res.status(401);
        return res.json({"err":"you must verify your mail"})
      }

      
  }

module.exports =   OtpHandler
