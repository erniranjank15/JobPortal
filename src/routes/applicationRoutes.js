import express, {Router} from "express"

import { applyJob,
   getJobApplications,
   getUserApplications,
   applicationStatus,} from "../controllers/Application.controller.js"

import { authMiddleware, authorizeRoles } from "../middlewares/authMiddleware.js"

const router = Router();


//Apply job
router.post("/apply",authMiddleware,authorizeRoles("applicant"), applyJob);


//User applied jobs
router.get("/my-applications",authMiddleware, getUserApplications);


//Recruiter see applications for job
router.get("/job/:jobId",authMiddleware,authorizeRoles("recruiter"),getJobApplications);

//Update status(Accept/Reject)
router.put("/status/:id", authMiddleware, authorizeRoles("recruiter"),applicationStatus);


export default router;

