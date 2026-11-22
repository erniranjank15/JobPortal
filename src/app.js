import express from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"

import userRoutes from "./routes/userRoutes.js"
import jobRoutes from "./routes/jobRoutes.js"
import applicationRoutes from "./routes/applicationRoutes.js"



const app = express();


//Middleware
const allowedOrigins = [
    "https://jobportalnk.netlify.app",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map(o => o.trim()) : [])
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps, curl, postman)
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true, limit:"20kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//Rotes
app.use("/api/v1/users",userRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/applications", applicationRoutes);


//Test & Keep-alive
app.get("/",(req,res)=>{
    res.send("Job Portal API running")
})

app.get("/health", (req, res) => {
    res.status(200).json({ status: "active", message: "Server is awake", timestamp: new Date().toISOString() });
})

app.get("/ping", (req, res) => {
    res.status(200).send("pong");
})



export default app;