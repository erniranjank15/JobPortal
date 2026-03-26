import mongoose from "mongoose";
import {Job} from "../models/Job.js"
import {User} from "../models/User.js"
import {Application} from "../models/Application.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"




//Apply job
  
 const applyJob = asyncHandler(async (req, res) => {
    
    const userId = req.user.id; // ✅ from auth middleware
    
    console.log("USER:", userId);

    const jobId = req.params.jobId; // ✅ from URL
    console.log("JOB:", jobId);

    //  1. Validate jobId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new ApiError(400, "Invalid Job ID");
    }

    //  2. Check job exists
    const job = await Job.findById(jobId);
    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    //  3. Prevent duplicate application
    const existingApplication = await Application.findOne({
        job: jobId,
        applicant: userId,
    });

    if (existingApplication) {
        throw new ApiError(409, "You already applied for this job");
    }

    //  4. Create application
    const application = await Application.create({
        job: jobId,
        applicant: userId,
    });

    if (!application) {
        throw new ApiError(500, "Failed to apply for job");
    }

    //  5. Send response
    return res.status(201).json(
        new ApiResponse(201, application, "Application submitted successfully")
    );
});




//get all applications
const getJobApplications = asyncHandler(async (req, res) => {

    const { jobId } = req.params;

    if (!jobId) {
        throw new ApiError(400, "Job ID is required");
    }

    const applications = await Application.find({ job: jobId })
        .populate("applicant", "name email")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            applications,
            applications.length > 0
                ? "Applications fetched successfully"
                : "No applications found"
        )
    );
});




//get user application

const getUserApplications = asyncHandler(async(req,res)=>{

    const applications = await Application.find({applicant:req.user.id}).populate("job");

    
    if(!applications || applications.length === 0){
        throw new ApiError(404, "No applications found")
    }

    return res.status(200).json(
        new ApiResponse(200, applications,)
    )
});




// update application status

const applicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { applicationId} = req.params;
   //console.log("appId:",applicationId);

  if (!(applicationId)) {
    return res.status(400).json({ message: "Invalid application ID" });
  }

  const application = await Application.findByIdAndUpdate(
    applicationId,
    { status },
    { returnDocument: "after" }
  );

  console.log("Updated Application:", application);

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  return res.status(200).json(
    new ApiResponse(200, application, "Application status updated")
  );
});




export{ 
    applyJob,
   getJobApplications,
   getUserApplications,
   applicationStatus,

}