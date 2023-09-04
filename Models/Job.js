const mongoose = require("mongoose")

let Job_Scheme = new mongoose.Schema({
  Company : {type:mongoose.SchemaTypes.ObjectId , required:true , ref:"User"},
  Type : {type:String , enum : ["Internship","Full_Time","Part_Time"] , required:true},
  PostedAt: {type:Date,required:true},
  Applications : [{type:mongoose.SchemaTypes.ObjectId , ref:"Application" }],
  Requirements : {type:String , required:true},
  Description : {type:String , required:true},
  Category : {type:mongoose.SchemaTypes.ObjectId , required:true , ref:"Category" },
  No_Vacancies : {type:mongoose.SchemaTypes.Number , required:true },
  Title : {type:mongoose.SchemaTypes.ObjectId , required:true , ref:"Role" },
  Country:{type:mongoose.SchemaTypes.ObjectId , required:true , ref:"Country" },
  City : {type:mongoose.SchemaTypes.ObjectId , required:true , ref:"City"}
})

let Job = new mongoose.model("Job",Job_Scheme)



module.exports =  Job