const { User ,  RefreshToken } = require("../Models/index.js")
const bcrypt  = require("bcryptjs")
const jwt = require("jsonwebtoken")



console.log(process.env.SECRET_KEY)

const SignIn =  async(req,res)=>{
    const {email , password} = req.body
    //let [access_token,refresh_token] = req.headers.cookie.split(";")
    //access_token = access_token.split("=")[1]
    //refresh_token = refresh_token.split("=")[1]
    //console.log(access_token,refresh_token)

    try{

    const result  = await User.findOne({Email:email});
    console.log(result)

    if(result){
        const match =  bcrypt.compareSync(password , result.Password)
        if(match){
           
            const refresh = await RefreshToken.createToken();
            let token;

          if(refresh){
            token = jwt.sign({Email:email},process.env.SECRET_KEY,{expiresIn:process.env.EXP_PER})
            const ans = await User.updateOne({Email:email},{$set:{"Token":refresh}})
          }

          else return res.status(408);

            res.status(200)
            res.header("Access-Control-Allow-Headers","*");
            res.header('Access-Control-Allow-Credentials', true);
            res.header("Access-Control-Allow-Origin","https://codsoft-1-z2b7.onrender.com");
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.cookie("access_token",token,{path:"/",httpOnly:false,sameSite:"none",secure:true,domain:".onrender.com"})
            res.cookie("refresh_token",refresh.token,{path:"/",httpOnly:false,secure:true,sameSite:"none",domain:".onrender.com"})
            res.cookie("email",email,{path:"/",secure:true,httpOnly:false,sameSite:"none",domain:".onrender.com"})
            res.cookie("user_id",result._id,{path:"/",httpOnly:false,secure:true,sameSite:"none",domain:".onrender.com"})

            let obj = Object.assign({},result._doc)
            delete obj.Password; delete obj.Token;
            console.log(obj)

            return res.json({"user":obj})
        }

          else{
            res.status(401)
            return res.json({"err":["Invalid Credentials"]})
          }
            
        }
        
    else{
         res.status(400)
         return res.json({"err":[" Account doesnot exist !"]})
    }

}
catch(err){
    console.log(err);
}

}

module.exports = SignIn

