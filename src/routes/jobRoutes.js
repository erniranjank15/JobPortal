import express, {Router} from "express"

import {createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    searchJob,} from "../controllers/Job.controller.js"

import { authMiddleware, authorizeRoles } from "../middlewares/authMiddleware.js"

const router = Router();

router.post("/create",authMiddleware,authorizeRoles("recruiter"),createJob);
router.get("/all",authMiddleware,authorizeRoles,getAllJobs);
router.get("/search", authMiddleware, searchJob);
router.get("/:id",authMiddleware,authorizeRoles("recruiter","admin"),getJobById);
router.put("/update/:id", authMiddleware,authorizeRoles("recruiter","admin"),updateJob);
router.delete("/delete/:id",authMiddleware,authorizeRoles("recruiter","admin"),deleteJob);


export default router;



