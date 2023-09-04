const  mongoose = require("mongoose")
const   bcrypt = require("bcryptjs")

const  {User} = require("../Models/index.js")

module.exports = SignUp =  async (req,res,next)=>{
   const {Email,Phone , Name , Password} = req.body

   const Check  = await User.CheckExisted(Email,Phone)

   let errors=[];
   
   Check.forEach((check)=>{
     if(check instanceof Error) errors.push(check.message)
   }) 

   if(errors.length) {res.status(409); console.log(errors);return res.json({err:errors})}

   else {return next();}
}

  

    