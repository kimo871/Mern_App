const  mongoose = require("mongoose")
const { User } = require("../Models/index.js")

let Authorize_wrapper = (allowed_role)=> (req,res,next)=>{
   //console.log(req.cookies)
   let token = req.token;
   let {email}= req.cookies
   User.findOne({Email:email})
   .then(result => {console.log(result.Role);
      if((result.Role == allowed_role)){req.user=result; console.log("d"); return next(); } 
      else {console.log("here"); res.status(401).json({"user":result}) }
})
   .catch(err=> {console.log(err);})

}


module.exports =  Authorize_wrapper;