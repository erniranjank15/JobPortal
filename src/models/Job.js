import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        index:true
    },

    description:{
        type:String,
        required:true
    },

    company:{
        type:String,
        required:true
    },

    location:{
        type:String,
        required:true,
        index:true
    },

    jobType:{
        type:String,
        enum:["Full-time", "Part-time", "Contract", "Internship"],
        default:"Full-time"
    },

    skills:{
        type:[String],
        required:true,
        index:true
    },


    salary:{
        type:String,
        default:"Not specified"
    },

    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }

},{
    timestamps:true
})


export const Job = mongoose.model("Job", jobSchema);
