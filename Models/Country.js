const mongoose = require("mongoose")

let Country_scheme= new mongoose.Schema({
    Name : {type:String , required:true,unique:true},
})

let Country = new mongoose.model("Country",Country_scheme)



module.exports =   Country