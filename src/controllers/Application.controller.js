import mongoose from "mongoose";
import { Job } from "../models/Job.js"
import { User } from "../models/User.js"
import { Application } from "../models/Application.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { sendEmail } from "../services/emailService.js";
import { applicationSubmittedEmail } from "../templates/jobApplnSubmitted.js";
import { applicationStatusEmail } from "../templates/applicationStatusEmail.js";


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





   try {
        await sendEmail({
            to: applicant.User.email,
            subject: "Application Submitted Successfully",
            html: applicationSubmittedEmail(applicant.User.name, job.Job.title, job.Job.company, application.createdAt),
        });
    } catch (emailError) {
        console.error("Application submission email failed to send:", emailError);
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

    const job = await Job.findById(jobId);
    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    // Authorization check
    if (req.user.role === "recruiter" && job.postedBy?.toString() !== req.user.id.toString()) {
        throw new ApiError(403, "Access denied. You can only view applications for your own jobs.");
    }

    if (req.user.role === "applicant") {
        throw new ApiError(403, "Access denied. Applicants cannot view job applications.");
    }

    const applications = await Application.find({ job: jobId })
        .populate("applicant", "name email resume")
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

const getUserApplications = asyncHandler(async (req, res) => {

    const applications = await Application.find({ applicant: req.user.id }).populate("job");


    if (!applications || applications.length === 0) {
        throw new ApiError(404, "No applications found")
    }

    return res.status(200).json(
        new ApiResponse(200, applications,)
    )
});




// update application status

const applicationStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { applicationId } = req.params;

    if (!(applicationId)) {
        return res.status(400).json({ message: "Invalid application ID" });
    }

    const application = await Application.findById(applicationId).populate("job");

    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    // Authorization check
    if (req.user.role === "recruiter" && application.job?.postedBy?.toString() !== req.user.id.toString()) {
        throw new ApiError(403, "Access denied. You can only update application status for your own jobs.");
    }

    if (req.user.role === "applicant") {
        throw new ApiError(403, "Access denied.");
    }

    application.status = status;
    const updatedApplication = await application.save();

    console.log("Updated Application:", updatedApplication);





   try {
        await sendEmail({
            to: applicant.User.email,
            subject: "Application Status Updated",
            html: applicationStatusEmail(applicant.User.name, job.Job.title, job.Job.company, application.status, status),
        });
    } catch (emailError) {
        console.error("Application status update email failed to send:", emailError);
    }







    return res.status(200).json(
        new ApiResponse(200, updatedApplication, "Application status updated")
    );
});




export {
    applyJob,
    getJobApplications,
    getUserApplications,
    applicationStatus,

}
