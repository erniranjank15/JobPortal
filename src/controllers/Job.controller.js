import mongoose from "mongoose";
import {Job} from "../models/Job.js"
import {User} from "../models/User.js"

import {asyncHandler} from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"


//Create Job
const createJob = asyncHandler(async (req, res) => {

    const role = req.user.role;

    if(role !== "recruiter"){
        throw new ApiError(403, "Only recruiters can create jobs")
    }

     const { title, description, company, location, salary } = req.body;
    

    if ([title, description, company, location, salary].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existingJob = await Job.findOne({
        title: title.trim(),
        company: company.trim(),
        location: location.trim(),
    });

    if (existingJob) {
        throw new ApiError(409, "Job already exists");
    }

    const job = await Job.create({
        title,
        description,
        company,
        location,
        salary,
        postedBy: req.user._id
    });

    const createdJob = await Job.findById(job._id);

    if (!createdJob) {
        throw new ApiError(500, "Something went wrong while creating the job");
    }

    return res.status(201).json(
        new ApiResponse(201, createdJob, "Job created Successfully")
    );

}
);


//get all jobs 


const getAllJobs = asyncHandler(async(req, res)=>{
    const jobs = await Job.find().populate("postedBy", "name", "email");

    if(jobs){
        return res.status(200).json(
            new ApiResponse(200, jobs)
        )
    }
    else{
        return new ApiError(404, "Jobs not found")
    }
});



//get single job

  const getJobById = asyncHandler(async(req,res)=>{

    const job = await Job.findById(req.params.id);

    if(!job){
        throw new ApiError(404, "Job not found")
    }

    return res.status(200).json(
        new ApiResponse(200, job)
    )
  });


//Update Job

const updateJob = asyncHandler(async(req,res)=>{

    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {new:true})

    if(!job){
        throw new ApiError(503, "Job is not updated")
    }

    return res.status(200).json(
        new ApiResponse(202, "Job updated")
    )

});


//Delete job

const deleteJob = asyncHandler(async (req, res) => {

    const deleted = await Job.findByIdAndDelete(req.params.id);

    if (!deleted) {
        throw new ApiError(404, "Job not found");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Job deleted successfully")
    );
});



//search jobs

const searchJob = asyncHandler(async (req, res) => {
    const keyword = req.query.keyword || "";

    const jobs = await Job.find({
        $or: [
            { title: { $regex: keyword, $options: "i" } },
            { company: { $regex: keyword, $options: "i" } },
            { location: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } }
        ]
    });

    if (jobs.length === 0) {
        throw new ApiError(404, "No jobs found");
    }

    return res.status(200).json(
        new ApiResponse(200, jobs)
    );
});













export {createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    searchJob,
}