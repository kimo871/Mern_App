require("dotenv").config()

module.exports = {
    PORT_NO :process.env.PORT_NO,

   DB_URL : process.env.DB_URL,
   
   DB_NAME : process.env.DB_NAME,
   
   HASH_KEY : process.env.HASH_KEY,
   
   EXP_PER : process.env.EXP_PER,
   
   SECRET_KEY : process.env.SECRET_KEY,
   
   MAIL_USERNAME :  process.env.MAIL_USERNAME,
   
   MAIL_PASSWORD : process.env.MAIL_PASSWORD,
   
   TIME_STAMP :  process.env.TIME_STAMP,

   DB_USERNAME : process.env.DB_USERNAME,
   DB_PASSWORD : process.env.DB_PASSWORD
   
}

