const  jwt = require("jsonwebtoken")


const decode  =  require("jwt-decode")
const { RefreshToken } = require("../Models/index.js")

const {SECRET_KEY , EXP_PER} = require("../Config/Config.js")

let Authenticate = (req,res,next)=>{
   
   let {access_token,refresh_token,email} = req.cookies
   req.token = access_token;
   

    if(!access_token || !refresh_token || !email) return res.status(403).json({err:["Invalid"]})
  
    jwt.verify(access_token,SECRET_KEY,(err,decoded)=>{
        if(err){
          RefreshToken.find({token:refresh_token}).then(result=> {
            if(result){
             const token = jwt.sign({Email:email},SECRET_KEY,{expiresIn:EXP_PER});
             req.token=token;
            }
          })
        }
        return next();
       
    });

}

module.exports =  Authenticate;