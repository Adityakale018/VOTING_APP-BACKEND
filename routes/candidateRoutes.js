const express = require('express');
const router =  express.Router();
const candidate=require('./../models/candidate');
const user=require('./../models/user');

const {jwtMiddleware,generateToken} = require('./../jwt');

const checkAdminrole = async (userID)=>{
    try{
        const User = await user.findById(userID)
        if(User.role=="admin"){
            return true;
        }
    }
    catch(err){
        return false;
    }
}


router.post('/', jwtMiddleware, async (req, res) => {
    try{
    if(! await checkAdminrole(req.user.id)){
        return res.status(404).json({message:'user has no admin role'});
    }
    const data=req.body; // req body contains person data
    //create new person document using mongoose model
    const Newcandidate = new candidate(data);

    const response =await Newcandidate.save();
    console.log("Data saved successfully");
    res.status(200).json({response:response})
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"});
    } 
})



//profile route
router.get('/profile',jwtMiddleware,async(req,res)=>{
    try{
        const userData = req.user;
        const userID = userData.id;
        const user = await person.findById(userID);

        res.status(200).json({user});
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:'internal server error'});
    }
})

router.post('/vote/:candidateID',jwtMiddleware,async(req,res)=>{

    candidateID = req.params.candidateID;
    userID = req.user.id;

    try{
        const Candidate = await candidate.findById(candidateID);
        if(!Candidate){
            return res.status(404).json({message:'candidate not found'})
        }

        const User = await user.findById(userID);
        if(!User){
            return res.status(404).json({message:'User not found'})
        }
        if(User.isvoted){
            return res.status(404).json({message:'U have already voted'})
        }
        if(User.role == "admin"){
            return res.status(404).json({message:'Admin not allow to vote'})
        }

        Candidate.votes.push({user:userID});
        Candidate.voteCount++;
        await Candidate.save();

        User.isvoted = true;
        await User.save();

        res.status(200).json({message:"you have voted successfully"})

    }
    catch(err){
        console.error(err);
        res.status(500).json({error:'internal server error'});
    }
})

router.get('/vote/count',jwtMiddleware,async(req,res)=>{
    try{
        const Candidate = await candidate.find().sort({voteCount:'desc'});

        const voterecord = Candidate.map((data)=>{
            return{
                name:data.name,
                party:data.party,
                voteCount:data.voteCount
            }
        })
        res.status(200).json(voterecord);
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:'internal server error'});
    }
})


// GET /candidate - Fetches a list of all candidates
router.get('/candidates', jwtMiddleware, async (req, res) => {
    try {
        // Find all documents in the candidate collection
        const allCandidates = await candidate.find();

        res.status(200).json(allCandidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'internal server error' });
    }
});


router.put('/:candidateID', jwtMiddleware, async (req, res) => {
    try {
        if(! await checkAdminrole(req.user.id)){
        return res.status(404).json({message:'user has no admin role'});
    }

        //console.log('Request Body:', req.body);
        //console.log('Request Body:', req.body);
        const candidateId = req.params.candidateID; // Extract the person's ID from the URL parameter
        const updatedcandidateData = req.body; // Extract the update data from the request body

        // Find the document by ID and update it
        const response = await candidate.findByIdAndUpdate(candidateId, updatedcandidateData, {
            new: true,           // This option returns the modified document, not the original
            runValidators: true, // This option ensures that updates adhere to your schema's validation rules
        });

        // If no document is found with the given ID, return a 404 error
        if (!response) {
            return res.status(404).json({ error: 'Person not found' });
        }

        // Send a success response with the updated document
        console.log('Data updated');
        res.status(200).json(response);

    } catch (err) {
        // If there's a server-side error, log it and send a 500 response
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:id', jwtMiddleware, async (req, res) => {
    try {
        if(!await checkAdminrole(req.user.id)){
        return res.status(404).json({message:'user has no admin role'});
    }

        //console.log('Request Body:', req.body);
        const candidateId = req.params.id; // Extract the person's ID from the URL parameter
         // Extract the update data from the request body

        // Find the document by ID and update it
        const response = await candidate.findByIdAndDelete(candidateId);
       

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

