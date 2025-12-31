const mongoose = require('mongoose');
const { type } = require('os');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        
    },
    mobile:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    aadharNumber:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['admin','voter'],
        default:'voter'
    },
    isvoted:{
        type:Boolean,
        default:false
    }
    
});

userSchema.pre('save',async function(next){
    const person = this;

    // hash the pass only if it is new or modified
    if(!person.isModified('password')) return next();
    try{
         // hash pass generation

         const salt = await bcrypt.genSalt(10);

         // hash pass

         const hashPassword = await bcrypt.hash(person.password,salt);

         person.password = hashPassword;
        next();

    }
    catch(err){
          return next(err);
    }
})

userSchema.methods.comparepassword = async function (candidatepassword) {
    try{
       const isMatch = await bcrypt.compare(candidatepassword,this.password);
       return isMatch;
    }
    catch(err){
         throw err;
    }
}

const user = mongoose.model('user',userSchema);
module.exports=user;