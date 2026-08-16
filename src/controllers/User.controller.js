
import { User } from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
<<<<<<< HEAD
import crypto from "crypto"
=======
>>>>>>> fd08176a88324cdcb4605da3b52d5af6e9873268
import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js"
import { sendEmail } from "../services/emailService.js";
import { welcomeEmail } from "../templates/welcomeEmail.js";
<<<<<<< HEAD
import { passwordResetEmail } from "../templates/passwordResetEmail.js";
=======
>>>>>>> fd08176a88324cdcb4605da3b52d5af6e9873268



//Register User
const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password, role } = req.body;


    // Check empty fields
    if ([name, email, password, role].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }


    //Check Admin registration only one admin can be register

    const isAdminExists = await User.findOne({ role: "admin" });

    if (role === "admin" && isAdminExists) {
        throw new ApiError(400, "An admin user already exists");
    }


    // Password validation
    if (password.length < 10) {
        throw new ApiError(400, "Password must be at most 10 characters long");
    }

    // Role validation
    if (!["applicant", "recruiter", "admin"].includes(role)) {
        throw new ApiError(
            400,
            "Invalid role specified. Allowed roles: applicant, recruiter, admin"
        );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);





    // Resume upload

    // Resume upload only for applicant
    // Resume Upload
    let resumeUrl = "";
    let resumePublicId = null;

    if (role === "applicant") {
        const resumeLocalPath = req.files?.resume?.[0]?.path;

        if (!resumeLocalPath) {
            throw new ApiError(400, "Resume is required");
        }

        const upload = await uploadOnCloudinary(resumeLocalPath);

        if (!upload) {
            throw new ApiError(400, "Resume upload failed");
        }

        resumeUrl = upload.secure_url;
        resumePublicId = upload.public_id;
    }

    // Create user
    const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role,
        resume: resumeUrl || "",
        resumePublicId: resumePublicId || "",
    });

    console.log(user);
    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }

    console.log("Sending welcome email to:", createdUser.email);

    try {
        await sendEmail({
            to: createdUser.email,
            subject: "Welcome to Job Portal",
            html: welcomeEmail(createdUser.name),
        });
    } catch (emailError) {
        console.error("Welcome email failed to send:", emailError);
    }



    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );

});


//get all users

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");

    if (users) {
        return res.status(200).json(
            new ApiResponse(200, users, "Users fetched successfully")
        )
    }
    else {
        throw new ApiError(404, "Users not found")
    }
});



//login

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    console.log("req.body:", req.body);

    if ([email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Email and password required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const loggedInUser = await User.findById(user._id).select("-password");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000
    };

    return res
        .status(200)
        .cookie("token", token, options)
        .json(
            new ApiResponse(200, loggedInUser, "Login successful")
        );
});



//logout

const logoutUser = asyncHandler(async (req, res) => {

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    };

    return res
        .status(200)
        .clearCookie("token", options)
        .json(
            new ApiResponse(200, {}, "User logged out successfully")
        );
});


//update profile

const updateUser = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId,
        {
            $set: {
                name,
                email: email
            }
        },
        {
            new: true
        }
    ).select("-password")


    if (!updatedUser) {
        throw new ApiError(500, "User cannot be updated")
    }

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "User updated successfully")
    )
});



//update resume


const updateResume = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const resumeLocalPath = req.file?.path;

    if (!resumeLocalPath) {
        throw new ApiError(400, "Resume file required");
    }

    // delete old resume
    if (user.resumePublicId) {
        await deleteFromCloudinary(user.resumePublicId);
    }

    // upload new resume
    const resumeUpload = await uploadOnCloudinary(resumeLocalPath);

    if (!resumeUpload) {
        throw new ApiError(400, "Resume upload failed");
    }

    user.resume = resumeUpload.secure_url;
    user.resumePublicId = resumeUpload.public_id;

    await user.save();

    return res.status(200).json(
        new ApiResponse(200, user, "Resume updated successfully")
    );
});



//change passward


const changePassword = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
        throw new ApiError(400, "Old password is incorrect");
    }


    if (newPassword.length < 10) {
        throw new ApiError(400, " New Password must be at least 10 characters long")
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt);


    user.password = hashedPassword;

    await user.save();

    return res.status(200).json(
        new ApiResponse(200, "Password changed successfully")
    )


});






//current user
const getCurrentUser = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "Current user fetched successfully"
        )
    );
});




//delete user


const deleteUser = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // delete resume from cloudinary
    if (user.resumePublicId) {
        await deleteFromCloudinary(user.resumePublicId);
    }

    await user.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, {}, "User deleted successfully")
    );
});















// Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email || email.trim() === "") {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
        // We don't reveal if user exists or not for security
        return res.status(200).json(
            new ApiResponse(200, {}, "If the email exists, a password reset link has been sent")
        );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // Hash token and save to database
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

    try {
        await sendEmail({
            to: user.email,
            subject: "Password Reset Request - Job Portal",
            html: passwordResetEmail(user.name, resetUrl),
        });

        return res.status(200).json(
            new ApiResponse(200, {}, "If the email exists, a password reset link has been sent")
        );
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        
        console.error("Password reset email error:", error);
        throw new ApiError(500, "Email could not be sent. Please try again later.");
    }
});

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
        throw new ApiError(400, "Password and confirm password are required");
    }

    if (password !== confirmPassword) {
        throw new ApiError(400, "Passwords do not match");
    }

    if (password.length < 10) {
        throw new ApiError(400, "Password must be at least 10 characters long");
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired reset token");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json(
        new ApiResponse(200, {}, "Password has been reset successfully")
    );
});


export {
    registerUser,
    getAllUsers,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateUser,
    changePassword,
    deleteUser,
    updateResume,
    forgotPassword,
    resetPassword
}
