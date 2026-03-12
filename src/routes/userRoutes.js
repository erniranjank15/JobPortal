import express, {Router} from "express"

import {registerUser,
     loginUser,
     logoutUser,
     getCurrentUser,
     updateUser,
     changePassword,
     getAllUsers,} from "../controllers/User.controller.js"

import {authMiddleware, authorizeRoles} from "../middlewares/authMiddleware.js"


const router = Router();


router.post("/register", registerUser);
router.post("/login",loginUser);
router.get("/logout", authMiddleware, logoutUser)
router.put("/update-profile",authMiddleware,updateUser)
router.put("/change-password", authMiddleware, changePassword)

//Admin
router.get("/all-users", authMiddleware,authorizeRoles("admin"),getAllUsers)


export default router;