const express=require('express');
const Conference=require('../models/conference_model');
// const committee=require('../models/committe_model');
const member=require('../models/members_model');
const router=express.Router();
const bodyParser = require('body-parser');
const Committee = require('../models/committe_model');
router.use(bodyParser.json());
router.post('/createcommittee/:id', async (req, res) => {
    try {
        const data = req.body.committees; // Accessing the committees array from the request body
        const id = req.params.id;
        const conference = await Conference.findById(id);
        
        if (!conference) {
            return res.status(404).json({ error: 'Conference not found' });
        }
       console.log(data);
        for (const com of data) {
            const newcom = new Committee({ committee_name: com }); // Creating a new committee object
            await newcom.save(); // Saving the new committee to the database
            conference.committee.push(newcom._id); // Adding the ID of the new committee to the conference's committee array
        }

        await conference.save(); // Saving the updated conference object
        
        res.status(200).json({ message: 'Committee added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/getmembersfromtpc/:conid',async(req,res)=>{
    try {
        const conid=req.params.conid;
        const conference = await Conference.findById(conid).populate('committee');

        if (!conference) {
            return res.status(404).json({ error: 'Conference not found' });
        }
        
         
        // // Extract members from the Technical Program Committee
         const tpc = conference.committee.find(committee => committee.committee_name === 'technical programme committee');
        

        //  conference.committee.forEach(m=>{
        //     console.log(m);
        //  })
         //res.send(tpc);
        if (!tpc) {
            return res.status(404).json({ error: 'Technical Program Committee not found for this conference' });
        }

         const memberIds = tpc.members; // Assuming 'members' is the field containing member IDs in the Committee model

        // Fetch member details from the User model or wherever members are stored
        const members = await member.find({ _id: { $in: memberIds } });

        // Send the list of members in the Technical Program Committee as a response
        res.json( members );

    } catch (error) {
         console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
router.get('/getcommittee/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Fetch the conference and populate the committee details
      const conference = await Conference.findById(id).populate('committee');
  
      if (!conference) {
        return res.status(404).json({ message: 'Conference not found' });
      }
  
      // Respond with both conference name and committee details
      res.status(200).json({
        conferenceName: conference.conference_title, // Adjust according to your field name
        committee: conference.committee
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
  router.delete('/deleteCommittee/:id', async (req, res) => {
    const { id } = req.params;
    //console.log('Deleting committee with ID:', id);
    try {
        const committee = await Committee.findByIdAndDelete(id);
        if (!committee) {
            return res.status(404).json({ message: 'Committee not found' });
        }
        return res.status(200).json({ message: 'Committee is deleted.' });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        return res.status(500).json({ message: 'Server error' });
    }
});

// Edit committee name API
router.put('/editCommittee/:id', async (req, res) => {
    try {
        const committeeId = req.params.id; // Get committee ID from request parameters
        const { committee_name } = req.body; // Get the new committee name from the request body

        // Find the committee by ID
        const committee = await Committee.findById(committeeId);
        
        if (!committee) {
            return res.status(404).json({ error: 'Committee not found' });
        }

        // Update the committee name
        committee.committee_name = committee_name;
        await committee.save(); // Save the updated committee

        res.status(200).json({ message: 'Committee updated successfully', committee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports=router;