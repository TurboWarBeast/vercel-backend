const express=require('express');
const router=express.Router();
const Conference=require('../models/conference_model');
const Track=require('../models/tracks_model');
const Topic=require('../models/topics_model');
const { populate } = require('../models/authors_work_model');

//-------------------------------------
router.post('/create', async (req, res) => {
  try {
    const con = req.body;
    const newconference = new Conference(con);
    const conf = await newconference.save();
    res.status(200).json(conf);
  } catch (error) {
    console.error("Error creating conference:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/fetch/:id',async(req,res)=>{
    try {
      const id=req.params.id;
      const con = await Conference.findById(id); 
      if(con){
        res.status(200).json(con);
      }else{
        res.send({error:"not exist"});
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({error:"iternal server error"});
    }
  
  });

router.get('/getallconference',async(req,res)=>{
 try {
  const conference = await Conference.find().populate({
    path: 'tracks'
});
 res.send(conference);
 } catch (error) {
  console.log(error);
 }
});

router.get('/getconferencebyid/:id',async(req,res)=>{
  try {
    const id=req.params.id;
    const conference = await Conference.findById(id).populate({
      path: 'tracks',
      populate: [
          { path: 'reviewers' }
      ]
  }).populate({
    path:'committee',
    populate:'members'
  });
  res.send(conference);
  } catch (error) {
   console.log(error);
  }
 });

 router.get('/conferenceAndTrack/:id', async (req, res) => {
  try {
    const conference = await Conference.findById(req.params.id).populate('tracks');
    
    if (!conference) {
      return res.status(404).send({ message: 'Conference not found' });
    }

    const response = {
      conference_title: conference.conference_title,
      tracks: conference.tracks.map(track => ({
        id: track._id,
        name: track.track_name
      }))
    };

    res.json(response);
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});

// Update conference API
router.put('/updateConference/:id', async (req, res) => {
  try {
    const conferenceId = req.params.id; // Get conference ID from request parameters
    const updatedData = req.body; // Get updated conference data from the request body

    // Find the conference by ID and update it with the new data
    const updatedConference = await Conference.findByIdAndUpdate(conferenceId, updatedData, { new: true });

    if (!updatedConference) {
      return res.status(404).json({ error: 'Conference not found' });
    }

    res.status(200).json(updatedConference); // Return the updated conference data
  } catch (error) {
    console.error('Error updating conference:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete conference API
router.delete('/deleteConference/:id', async (req, res) => {
  try {
    const conferenceId = req.params.id;
    const deletedConference = await Conference.findByIdAndDelete(conferenceId);

    if (!deletedConference) {
      return res.status(404).json({ error: 'Conference not found' });
    }

    res.status(200).json({ message: 'Conference deleted successfully' });
  } catch (error) {
    console.error('Error deleting conference:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports=router;


// Done
