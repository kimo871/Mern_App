const express = require("express")
const mongoose = require("mongoose")


const Router= express.Router()

const Mailer_Handler = require("../Controllers/Email.js")

const Authentication = require("../Middlewares/Authnetication.js")

const Authorization = require("../Middlewares/Authorize.js")

const { Job , User , Application } = require( "../Models/index.js")


// posting jobs page

Router.get("/jobs/post",[Authentication,Authorization("Company")],(req,res)=>{
    const {user_id} = req.cookies;
    User.findOne({_id:user_id}).then(result=>{
        let obj=Object.assign({},{_id:result._id,Name:result.Name,Email:result.Email,DateOfBirth:result.DateOfBirth,Phone:result.Phone,Role:result.Role,Image:result.Image});
        console.log(obj)
        res.status(200);
        res.header("Access-Control-Allow-Headers","*");
            res.header('Access-Control-Allow-Credentials', true);
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.cookie("access_token",req.token,{path:"/",httpOnly:false,sameSite:"none",secure:true})
        res.json({"user":obj});
})

}).post("/jobs/post",[Authentication,Authorization("Company")],(req,res)=>{
    if(req.body){
        let PostedAt = new Date();
        req.body['PostedAt']=PostedAt; 
        let new_job = new Job(req.body).save().then(result=>{console.log(result); res.status(200) }).catch(err=> {console.log(err);res.status(500)})
    }
    else{
        res.status(422)
    }
    res.send()
})


// editing profile page


Router.post("/Edit/Profile",Authentication,async(req,res)=>{
    let obj={}
   console.log(Object.entries(req.body))
   Object.entries(req.body).forEach((item)=> item[1]!== undefined ? obj[item[0]]=item[1] : false)
   let {user_id}=req.cookies;
   console.log(obj['Email'])
     let e = await User.findOne({Email:obj['Email'],_id:{$ne:user_id}}).then(res=>res)
     let p = await User.findOne({Phone:obj['Phone'],_id:{$ne:user_id}}).then(res=>res)
     console.log(e,p)
    if(e&&[obj['Email']] || p&&obj['Phone']){
        res.status(409).send()
    }
   
   let result =  await User.updateOne({_id:user_id},{$set:obj})
   console.log(result)
   if(result.modifiedCount){res.status(200)
    if(obj['Email']) res.cookie("email",obj["Email"]) 
    res.send()}
   else res.status(400).send()

})

// MyJobs Page
/*
 Router.get("/job/app",async(req,res)=>{
    const {id} = req.query;
    let y = await Job.findOne({_id:id}).populate("Applications")
    res.json({"applications":y})
 })

 */

 Router.get("/job/app",async(req,res)=>{
    const {id} = req.query;
    let y = await Application.find({Job:id,Status:"pending"}).populate("Owner").populate("Job").then(res=>res)
    console.log(y)
    res.json({"applications":y})

 })
 

 

 // MyJobs

 Router.get("/MyJobs",Authentication,Authorization("Company"),(req,res)=>{
    const {user_id} = req.cookies;
    User.findOne({_id:user_id}).then(result=>{
        let obj=Object.assign({},{_id:result._id,Name:result.Name,Email:result.Email,DateOfBirth:result.DateOfBirth,Phone:result.Phone,Role:result.Role,Image:result.Image});
        console.log(obj)
        res.status(200);
        res.header("Access-Control-Allow-Headers","*");
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.cookie("access_token",req.token,{path:"/",httpOnly:false,sameSite:"none",secure:true})
        res.json({"user":obj});})
 })

 // Apply Page

 Router.get("/Apply",Authentication,Authorization("Employee"),(req,res)=>{
    const {user_id} = req.cookies;
    User.findOne({_id:user_id}).then(result=>{
        let obj=Object.assign({},{_id:result._id,Name:result.Name,Email:result.Email,DateOfBirth:result.DateOfBirth,Phone:result.Phone,Role:result.Role,Image:result.Image});
        console.log(obj)
        res.status(200);
        res.header("Access-Control-Allow-Headers","*");
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.cookie("access_token",req.token)
        res.json({"user":obj});})
 })


 Router.post("/Apply",Authentication,Authorization("Employee"),async (req,res)=>{
    const{id}=req.query;
    const {user_id} = req.cookies;
    const {Cv , Cover} = req.body;
    console.log(id,user_id)

    try{
        let found = await Application.findOne({Job:id,Owner:user_id}).then(res=>res)
        if(!found){
        let app = await new Application({Owner:user_id,Job:id,Cv:Cv,Cover_Letter:Cover}).save().then(res=>res);
        if(app){
           await Job.updateOne({_id:id},{$push:{"Applications":app._id}});
            res.status(200).json({"msg":["Application Saved!"]})
        }
        else{
            res.status(500).send()
        }
    }
    else{
        res.status(403).json({"err":["Sorry ! You Already Applied "]})
    }
    }
    catch(err){
        res.status(500).send()
    }
  
   })



   // Accept or refuse

   Router.put("/Application/Accept",Authentication,Authorization("Company"),Mailer_Handler("Accept"))

   Router.put("/Application/Reject",Authentication,Authorization("Company"),Mailer_Handler("Reject"))



module.exports =   Router