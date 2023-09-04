const mongoose = require("mongoose")

let Application_scheme= new mongoose.Schema({
    Owner:{type:mongoose.SchemaTypes.ObjectId , ref:"User"},
    Job : {type:mongoose.SchemaTypes.ObjectId , ref:"Job"},
    Cover_Letter :  {type:String , required:true},
    Cv : {type:String , required:true},
    Status : {
        type : String,
        enum :  ['accepted','pending','rejected'],
        default : "pending"
    }

})

let Application = new mongoose.model("Application",Application_scheme)





module.exports =  Application