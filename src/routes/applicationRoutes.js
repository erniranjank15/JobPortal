import express, {Router} from "express"

import { applyJob,
   getJobApplications,
   getUserApplications,
   applicationStatus,} from "../controllers/Application.controller.js"

import { authMiddleware, authorizeRoles } from "../middlewares/authMiddleware.js"

const router = Router();

//User applied jobs - must be BEFORE /:jobId to avoid conflict
router.get("/my-applications", authMiddleware, authorizeRoles("applicant"), getUserApplications);

//Apply job
router.post("/apply/:jobId", authMiddleware, authorizeRoles("applicant"), applyJob);

//Recruiter see applications for job
router.get("/job/:jobId", authMiddleware, getJobApplications);

//Update status(Accept/Reject)
router.put("/status/:applicationId", authMiddleware, applicationStatus);


export default router;

