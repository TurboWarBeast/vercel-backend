
const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
    name: {
        type: String
    },
    affiliation: {
        type: String
    },
    country: {
        type: String
    },
    contact_no: String,
    email: {
        type: String,
        required: true

    },
    google_sh_id: {
        type: String,
        default: null  // Optional
    },
    orcid_id: {
        type: String,
        default: null  // Optional
    },
    title: {
        type: String
    },
    keywords: {
        type: String
    },
    abstract: {
        type: String
    },
    pdf: {
        type: String,
        required: true
    },
    pdfLink:{
    type:String,
    required: true
    },
    co_authors: [{
        name: { type: String },
        affiliation: { type: String  },
        country: { type: String },
        contact_no: String,
        email: { type: String },
        google_sh_id: { type: String, default: null },  // Optional
        orcid_id: { type: String, default: null }       // Optional
    }],
    reviewers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reviewer'
    }],
    track:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Track'
    }
},{
    timestamps:true
});

const Paper = mongoose.model('Paper', paperSchema);
module.exports = Paper;
