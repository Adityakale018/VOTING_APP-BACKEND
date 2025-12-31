const mongoose=require('mongoose');
require('dotenv').config();

// mongodb connection url

//const mongoURL='mongodb://127.0.0.1:27017/hotels'
const mongoURL=process.env.MONGODB_URL

// setup mongodb connection

mongoose.connect(mongoURL);
const db=mongoose.connection;

// event listners on databases

db.on('connected',()=>{
    console.log("connected to mongoDB server");
})

db.on('error',(err)=>{
    console.error("connected to database server"),err;
})

db.on('disconnected',()=>{
    console.log("disconnected to database server");
})
//default connection 



//export database connection

module.exports=db;