
const  bcrypt = require("bcryptjs")
const  jwt = require("jsonwebtoken")
const  User = require("../Models/User.js")


const  SignUp = async  (req,res)=>{
let u1;
let Token;

const {Email , Phone , DOB , Password , Name , Type , Image  } = req.body

const role = Type;

//Token = jwt.sign({Email: email},SECRET_KEY,{"expiresIn":EXP_PER}) 

try{

   const result = User.findOne({Email:Email})


   let pswd =  bcrypt.hashSync(Password  , 7)


   /* const back_token_model = await RefreshToken.createToken();

   if(back_token_model instanceof Error) return res.send(500)

   */
  console.log(req.body)
   
   const u1 =  new User({
         Name : Name,
         Image : Image,
         Email : Email,
         Phone : Phone,
         Password:pswd,
         DateOfBirth:DOB,
         CreatedAt : new Date(),
         Role : role
      })

   const result1 = await u1.save();

    
 console.log(u1)
     
  res.status(200)
  return res.json({user:u1})

}

catch(err){
   console.log(err.message)
   res.status(500)
   res.json({err:["Failed Try Again !"]})
}

}





module.exports =  SignUp;