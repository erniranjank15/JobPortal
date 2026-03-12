import express, {Router} from "express"

import {createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    searchJob,} from "../controllers/Job.controller.js"

import { authMiddleware, authorizeRoles } from "../middlewares/authMiddleware.js"

const router = Router();

router.post("/create",authMiddleware,authorizeRoles,createJob);
router.get("/all",getAllJobs);
router.get("/search", searchJob);
router.get("/:id",getJobById);
router.put("/update/:id", authMiddleware,authorizeRoles("recruiter"),updateJob);
router.delete("/delete/:id",authMiddleware,authorizeRoles("recruiter","admin"),deleteJob);


export default router;



