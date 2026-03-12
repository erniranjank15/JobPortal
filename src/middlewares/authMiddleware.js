import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

//Authentication Middleware
export const authMiddleware = asyncHandler(async (req, res, next) => {

    const token = req.cookies?.token;

    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
    );

    req.user = decodedToken;

    next();
});


//Role authorization middleware

export const authorizeRoles = (...roles)=>{

    return (req, res, next)=>{

        if(!roles.includes(req.user.role)){
            throw new ApiError(403, "You are not allowed to access this resource")
        }

        next();
    }
}