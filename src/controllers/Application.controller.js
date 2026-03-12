import mongoose from "mongoose";
import {Job} from "../models/Job.js"
import {User} from "../models/User.js"
import {Application} from "../models/Application.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"




//Apply job

const applyJob = asyncHandler(async(req, res)=>{

const {jobId} = req.body;


//duplicate applications


const existingApplication = await Application.findOne({job:jobId, applicant:req.user.id});
     
    if(existingApplication){
        throw new ApiError(403, "You already applied for this job")
    }

const application = await Application.create({
    job:jobId,
    applicant:req.user.id,

})

if(application){
    return res.status(200).json(
        new ApiResponse(201, "Application Submitted")
    )
}
else{
    throw new ApiError(501, "something went wrong while submitting application")
}


});





//get all applications

const getJobApplications = asyncHandler(async(req,res)=>{

    const applications = await Application.find({job: req.params.jobId}).populate('applicant', "name email");

    if(!applications || applications.length === 0){
        throw new ApiError(404, "No applications found for this job")
    }

    return res.status(200).json(
        new ApiResponse(200, applications,)
    )

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

const applicationStatus = asyncHandler(async(req,res)=>{

     const {status} = req.body;

     const application = await Application.findByIdAndUpdate(req.params.id, {status}, {new:true});

      if(!application){
        throw new ApiError(404, "Application not found")
    }

    return res.status(200).json(
        new ApiResponse(202, application, "Application status updated")
    )
});






export{ applyJob,
   getJobApplications,
   getUserApplications,
   applicationStatus,

}