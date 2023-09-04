const  jwt = require("jsonwebtoken")


const decode  =  require("jwt-decode")
const { RefreshToken } = require("../Models/index.js")

require("dotenv").config({path:"./Config/.env"})

let Authenticate = (req,res,next)=>{
   
   let {access_token,refresh_token,email} = req.cookies
   req.token = access_token;
   

    if(!access_token || !refresh_token || !email) return res.status(403).json({err:["Invalid"]})
  
    jwt.verify(access_token,process.env.SECRET_KEY,(err,decoded)=>{
        if(err){
          RefreshToken.find({token:refresh_token}).then(result=> {
            if(result){
             const token = jwt.sign({Email:email},SECRET_KEY,{expiresIn:process.env.EXP_PER});
             req.token=token;
            }
          })
        }
        return next();
       
    });

}

module.exports =  Authenticate;