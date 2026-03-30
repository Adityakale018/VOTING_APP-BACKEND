const express = require('express');
const router =  express.Router();
const user=require('./../models/user');

const {jwtMiddleware,generateToken} = require('./../jwt');



router.post('/signup', async (req,res)=>{
    try{
    const data=req.body; // req body contains person data
    //create new person document using mongoose model
    const Newuser = new user(data);

    const response =await Newuser.save();
    console.log("Data saved successfully");

    const payload = {
        id:response.id,
        username: response.username,
        role: response.role
    }

    const token = generateToken(payload);
    console.log("token is:",token)

    res.status(200).json({response:response,token:token})
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"});
    } 
})

//login route

router.post('/login',async(req,res)=>{
    try{
    // Extract aadharNumber and pass from user
    const {aadharNumber,password} = req.body;

    //find user by aadharNumber
    const User = await user.findOne({aadharNumber: aadharNumber});

    // if user dont exist or invalid pass then return error
    if(!User || !(await User.comparepassword(password))){
        return res.status(401).json({error:'Invalid username or password'});
    }

    // generate token
    const payload ={
        id:User.id,
        username: User.username,
        role: User.role
    }
    const token = generateToken(payload);
    res.json({token})
    }catch(err){
        console.error(err);
        res.status(500).json({error:'internal server error'});
    } 
})

//profile route
router.get('/profile',jwtMiddleware,async(req,res)=>{
    try{
        const userData = req.user;
        const userID = userData.id;
        const User = await user.findById(userID);

        res.status(200).json(User);
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:'internal server error'});
    }
})


router.put('/profile/password',jwtMiddleware, async (req, res) => {
    try {

        //console.log('Request Body:', req.body);
        const userId = req.user.id; // Extract the person's ID from the URL parameter
        const {currentpassword,newpassword} = req.body;

         //find user by userID
         const User = await user.findById(userId)

        if(!(await User.comparepassword(currentpassword))){
            return res.status(401).json({error:'Invalid username or password'});
        }

        User.password = newpassword;
        await User.save();
        

        // Send a success response with the updated document
        console.log('Passowrd updated');
        res.status(200).json({ message: 'Password updated successfully' });

    } catch (err) {
        // If there's a server-side error, log it and send a 500 response
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {

        //console.log('Request Body:', req.body);
        const personId = req.params.id; // Extract the person's ID from the URL parameter
         // Extract the update data from the request body

        // Find the document by ID and update it
        const response = await person.findByIdAndDelete(personId);
       

        // If no document is found with the given ID, return a 404 error
        if (!response) {
            return res.status(404).json({ error: 'Person not found' });
        }

        // Send a success response with the updated document
        console.log('Data deleted');
        res.status(200).json({message:'data deleted successfully'});

    } catch (err) {
        // If there's a server-side error, log it and send a 500 response
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;

