import {User} from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import {asyncHandler} from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js" 




//Register User

const registerUser = asyncHandler(async(req,res)=>{


    const {name, email, password, role, resume} = req.body
    //console.log("email: ", email);
      console.log("req-body: ",req.body)
    if( [name, email, password, role, resume].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All fields are required");
        
    }


    const existingUser = await User.findOne({
           $or: [{ email },{role}]
    })


    if(existingUser){
        throw new ApiError(409, "User with email or role already exists");
    }


    if(password.length < 10){
        throw new ApiError(400, "Password must be at least 10 characters long")
    }
    
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)



    if (!["applicant", "recruiter", "admin"].includes(role)) {
        throw new ApiError(400, "Invalid role specified. Allowed roles are 'jobseekar', 'recruiter', 'admin'");
    }



      const resumeLocalPath = req.files?.resume[0]?.path;
    
      console.log("req-files: ",req.files)

     if (!resumeLocalPath) {
        throw new ApiError(400, "Resume file is required")
    }


    
    const resumeUrl = await uploadOnCloudinary(resumeLocalPath)


      if (!resumeUrl) {
        throw new ApiError(400, "Resume file is required")
    }


    const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(), 
        password: hashedPassword,
        role,
        resume: resumeUrl.url || "",
        
      
    })

    const createdUser = await User.findById(user._id).select(
        "-password"
    )


    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})


//get all users

const getAllUsers = asyncHandler(async(req, res)=>{
    const users = await User.find().select("-password");

    if(users){
        return res.status(200).json(
            new ApiResponse(200, users, "Users fetched successfully")
        )
    }
    else{
        throw new ApiError(404, "Users not found")
    }
});



//login

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

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
        secure: false, // true in production
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
        secure: false
    };

    return res
        .status(200)
        .clearCookie("token", options)
        .json(
            new ApiResponse(200, {}, "User logged out successfully")
        );
});


//update

const updateUser = asyncHandler(async(req, res)=>{

    const userId = req.user.id;

    const {name, email} = req.body;

     const updatedUser= await User.findByIdAndUpdate(userId,
        {
            $set:{name,
                email:email
            }
        },
        {
            new:true
        }
    ).select("-password")

   
    if(!updateUser){
        throw new ApiError(500, "User cannot updated")
    }

    return res.status(200).json(
        new ApiResponse(200, "User updated successfully", updateUser)
    )
});



//change passward


const changePassword = asyncHandler(async(req,res)=>{

    const userId = req.user.id;

    const {oldPassword, newPassword} = req.body;

    const user = await User.findById(userId);

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if(!isMatch){
        throw new ApiError(400, "Old password is incorrect");
    }


      if(newPassword.length < 10){
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




















export {registerUser,
    getAllUsers,
     loginUser,
     logoutUser,
     getCurrentUser,
     updateUser,
     changePassword,
}




































