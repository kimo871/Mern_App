
const nodemailer = require("nodemailer")
const mongoose = require("mongoose")

const {Application , Job} = require("../Models/index.js")



let mailer = nodemailer.createTransport({
    service : "hotmail",
    secure:false,
    auth:{
    user : process.env.MAIL_USERNAME,
    pass : process.env.MAIL_PASSWORD}
})

const MailDetails = (email, subject , content)=>{
    let MailOptions = {
      "from" : process.env.MAIL_USERNAME,
      "to" : email,
      "subject" : subject,
      "text" : content
    }

    console.log(MailOptions)

    return MailOptions;
}


const Mailer_Handler = (type)=>{
   return (req,res)=>{
       const {id} = req.query;
      const {email} = req.cookies;
      const obj  = req.body
      Job.findOne({_id:req.body.Job._id}).populate("Title").populate("Country").populate("City").populate("Company").then(result =>{

     let msg = `Hi ${obj.Owner.Name} Thank you for applying to the 
     ${result.Title.Title} position at ${result.Company.Name} , ${result.Country.Name} , ${result.City.Name} .${type=="Accept" ? "We Would like to Congratulate You on being among our qualified candidates Our hiring team is currently reviewing all applications you will receive a call from our one of our recruiters to schedule  phone interview , Thanks." 
     :  "Unfortunately We regret to inform you that we cannot accommodate all candidates , Please Understand that this decision  doesnot reflect on your qualifications or potential , Thanks."} `

     mailer.sendMail(MailDetails(req.body.Owner.Email,"Application Update",msg),(err,data)=>{
    if(err)res.status(403).send()
    else {
      Application.updateOne({_id:id},{$set:{"Status":type=="Accept" ? "accepted" : "rejected"}}).then(result => res.status(200).send())
      res.status(200).send()
     }
    })

    })
}

}


module.exports =  Mailer_Handler;