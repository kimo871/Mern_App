const  mongoose = require("mongoose")



let User_Scheme = new mongoose.Schema({
  Image:{type:String , required:true},
  Name : {type:String , required:true },
  Email : {type:String , required:true , unique:true},
  Phone : {type:String , required:true , unique:true},
  CreatedAt : {type:Date , required:true},
  DateOfBirth : {type:String,required:true},
  Password : {type:String , required:true },
  Token : {type:mongoose.SchemaTypes.ObjectId , ref :"RefreshToken" },
  Role : {type:String , enum : ["Company","Employee"]},
  Status : {type:String , enum:["Active","Pending"]},
})

User_Scheme.statics.ForgetPassword = async function (obj){
   
}

User_Scheme.statics.DeleteAccount = function(user){

}

User_Scheme.statics.LogOut = function (email,token){
  return User.updateOne({Email:email},{$unset : {"Token":""}})
}

User_Scheme.statics.ChangePassword = function(user){
    
}

User_Scheme.statics.CheckExisted= async function(email,phone){
  let res_mail = await  User.findOne({Email:email})
  let res_phone = await User.findOne({Phone:phone})
  console.log(res_mail,res_phone)
  if(res_mail) res_mail = new Error("Email Already Exists!")
  if(res_phone) res_phone = new Error("Phone Already Exists!");
  return [res_mail,res_phone];
}


let User = new mongoose.model("User",User_Scheme)

module.exports =  User