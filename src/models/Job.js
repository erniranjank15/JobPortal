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
        index:true
    },


    salary:Number,

    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }

},{
    timestamps:true
})


export const Job = mongoose.model("Job", jobSchema);