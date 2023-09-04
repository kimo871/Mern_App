const express = require('express')

const process = require('process')

const cors =  require('cors')

const mongoose = require('mongoose')

const Router = require("./Path/auth.js")

const Router2 = require("./Path/employer.js")

const path = require("path")

require("dotenv").config({path:"./Config/.env"})

const cookie = require("cookie-parser")

const session = require("express-session")

const Authentication = require("./Middlewares/Authnetication.js")
const { User, RefreshToken , Role , Category , City  ,Country , Job, Application } = require("./Models/index.js")


const app = express();


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.vgv6oyv.mongodb.net/test?retryWrites=true&w=majority`;

app.use(express.json({limit: "50mb", extended: true, parameterLimit:50000}))

app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));


app.use(cookie())

app.use(session({
    secret:"secret",
    resave:false,
    cookie:{
        secure:true,
        maxAge:1000*60*60*24,
        sameSite:"none",
        httpOnly:false,
        domain:"codsoft-1.onrender.com"
    }
}))


app.use(express.static(path.join(__dirname,'build')));

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"build","index.html"))
})


app.post("/api/Logout",Authentication,(req,res)=>{
    let {email,refresh_token} = req.cookies;
    Promise.all([User.LogOut(email),RefreshToken.deleteToken(refresh_token)]).then(()=>{
        res.status(200);
        return res.send("Logout Successfully")
    }).catch(err=>{
        res.status(402)
        return res.send("Fauled Try Again!")
    })
})



app.use("/api/auth",Router)

app.use("/api/role",Router2)



app.post("/api/Profile",[Authentication],(req,res)=>{
    res.status(200).cookie("access_token",req.token,{domain:"onrender.com"});
    return res.send();
})


app.get("/api/categories",async(req,res)=>{
  const result = await Category.find({}).then(res=>{
    const map = new Map();
    res.forEach((item)=> map.set(item.category,item));
    return map;
  })
  let y = Object.fromEntries(result);
  return res.json({"categories":y})
})

app.get("/api/job-titles",async(req,res)=>{
    const result = await Role.find({}).then(res=>{
        const map = new Map();
        res.forEach((item)=> map.set(item.Title,item));
        
        return map;
      })
      let y = Object.fromEntries(result);
      return res.json({"jobs":y})
})





app.get("/api/countries/",async(req,res)=>{
    
    const result = await Country.find({}).then(res=>{
        const map = new Map();
        res.forEach((item)=> map.set(item.Name,item));
       
        return map;
      })
      let y = Object.fromEntries(result);
      return res.json({"countries":y})
})

app.get("/api/cities/",async(req,res)=>{
    const {country} = req.query
    console.log(req.query)
    let result;
   
        result = await City.find({country:country}).then(res=>{
        const map = new Map();
        res.forEach((item)=> map.set(item.Name,item));
        return map;
      })
      let y = Object.fromEntries(result);
      return res.json({"cities":y})
})

app.get("/api/jobs/",async(req,res)=>{
    let {page_no=1 , limit=5 , Country='none' , City='none' , Category='none' , Title='none'}=req.query;

    let obj = {Country:Country , City:City , Title:Title , Category:Category}
    

    Object.keys(obj).forEach((item)=> obj[item] === "none" ? delete obj[item]: false);
    console.log(obj)

    let count_doc = await Job.countDocuments(obj).then(res=>res);
    let total_no_pages = Math.ceil(count_doc/limit);


    let result = await Job.find(obj).skip((page_no-1)*limit*1).limit(limit*1).populate("Company","Name Image ").populate("Country").populate("City").populate("Title").populate("Category").then(res=>res);
    if(result){
        res.status(200)
        res.json({"jobs":result,
                  "page_no":page_no,
                  "count_doc":count_doc,
                  "total_no_pages":total_no_pages})
    }
    else{
        res.status(400)
        res.send()
    }
})

app.get("/api/job/",async(req,res)=>{
    const {id}=req.query
    console.log(id)
        let job = await Job.findOne({_id:id}).populate("Company").populate("Category").populate("City").populate("Country").populate("Title").then(res=>res)
        if(job){ console.log(job); res.status(200).json({"jobs":[job]})}
        else res.sendStatus(500);
    
})



app.get("/api/jobs/app/",async(req,res)=>{
    const {id} = req.query;
    console.log(id)
    await Job.find({Company:id})
    .populate("Company","Name Image ")
    .populate("Country")
    .populate("City")
    .populate("Title").populate("Category")
    .then(res=>res).then((result)=>{ res.status(200); res.json({"jobs":result}); })
    .catch((err)=>{ res.status(500); res.json({"err":["Internal Server Error !"]})})
      
 })





app.listen(process.env.PORT_NO, ()=>{

    console.log(`Server Listening Successfully on ${process.env.PORT_NO} !`)
    mongoose.connect(uri).then(()=>{
       console.log("Database Connected !")
    }).catch(err=>{
        console.log(err.message)
    })
})

app.listen(4500,()=>{
    console.log("connected")
})