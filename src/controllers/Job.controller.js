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

     const { title, description, company, location, jobType, skills, salary } = req.body;

    const requiredTextFields = [title, description, company, location];
    if (requiredTextFields.some((field) => typeof field !== "string" || field.trim() === "")) {
        throw new ApiError(400, "Title, description, company, and location are required and must be non-empty strings");
    }

    if (jobType !== undefined && jobType !== null && (typeof jobType !== "string" || jobType.trim() === "")) {
        throw new ApiError(400, "jobType must be a non-empty string when provided");
    }

    let skillsArray;
    if (typeof skills === "string") {
        skillsArray = skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean);
    } else if (Array.isArray(skills)) {
        skillsArray = skills
            .map((skill) => (typeof skill === "string" ? skill.trim() : ""))
            .filter(Boolean);
    } else {
        throw new ApiError(400, "Skills must be provided as a comma-separated string or non-empty array of strings");
    }

    if (skillsArray.length === 0) {
        throw new ApiError(400, "Skills must be a non-empty array of non-empty strings");
    }

    if (salary !== undefined && salary !== null && typeof salary !== "string") {
        throw new ApiError(400, "Salary must be a string when provided");
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
        jobType,
        skills: skillsArray,
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
    const jobs = await Job.find().populate("postedBy", "name email");

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

    const updateData = { ...req.body };

    if (updateData.skills !== undefined) {
        const { skills } = updateData;

        if (typeof skills === "string") {
            updateData.skills = skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean);
        } else if (Array.isArray(skills)) {
            updateData.skills = skills
                .map((skill) => (typeof skill === "string" ? skill.trim() : ""))
                .filter(Boolean);
        } else {
            throw new ApiError(400, "Skills must be a comma-separated string or array of strings");
        }

        if (updateData.skills.length === 0) {
            throw new ApiError(400, "Skills must include at least one valid skill");
        }
    }

    const job = await Job.findByIdAndUpdate(req.params.id, updateData, {new:true})

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