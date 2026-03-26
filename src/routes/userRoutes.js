import express, {Router} from "express"

import {registerUser,
     loginUser,
     logoutUser,
     getCurrentUser,
     updateUser,
     changePassword,
     getAllUsers,
     updateResume,
     deleteUser,
      
     
} from "../controllers/User.controller.js"

import {authMiddleware, authorizeRoles} from "../middlewares/authMiddleware.js"
import {upload} from "../middlewares/multer.middleware.js"


const router = Router();


router.post("/register",  upload.fields([{ name: "resume", maxCount: 2 }]) , registerUser);
router.post("/login",loginUser);
router.get("/logout", authMiddleware, logoutUser)
router.get("/me", authMiddleware, getCurrentUser)
router.put("/update-profile",authMiddleware,updateUser)
router.put("/change-password", authMiddleware, changePassword)
router.delete("/delete-user/:id", authMiddleware, deleteUser);
router.patch(
    "/update-resume",
    authMiddleware,
    upload.single("resume"),
    updateResume
);




//Admin
router.get("/all-users",authMiddleware, authorizeRoles("admin"), getAllUsers)


export default router;