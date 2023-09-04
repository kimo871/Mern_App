const mongoose = require("mongoose")

let Role_scheme= new mongoose.Schema({
    Title : {type:String , required:true,unique:true},
    Category : {type:mongoose.SchemaTypes.ObjectId , ref:"Category" , required:true}

})

let Role = new mongoose.model("Role",Role_scheme)

let array = [{
    "Title": "Human resources manager"
  },
  {
    "Title": "Compensations and benefits manager"
  },
  {
    "Title": "Administrative assistant"
  },
  {
    "Title": "Human resources generalist"
  },
  {
    "Title": "Talent acquisition coordinator"
  },
  {
    "Title": "Executive recruiter"
  },
  {
    "Title": "Human resources specialist"
  },
  {
    "Title": "Human resources director"
  },
  {
    "Title": "Human resources assistant"
  },
  {
    "Title": "Labor relations specialist"
  },
  {
    "Title": "Human resources consultant"
  },
  {
    "Title": "International human resources associate"
  },
  {
    "Title": "Human resources systems administrator"
  },
  {
    "Title": "Compensation advisor"
  },
  {
    "Title": "Training and development manager"
  }]

  array.forEach((item)=> {item.Category="64f36d6e0f8664ca990ad414"; let t1 = new Role(item)})

module.exports =  Role