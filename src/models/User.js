import mongoose from "mongoose"

const userSchema = new mongoose.Schema({

 name:{
    type:String,
    required:true,
    index:true
 },

 email:{
    type:String,
    required:true
 },


  password:{
    type:String,
    required:true
 },


 role:{
    type:String,
    enum: ['applicant', 'recruiter', 'admin'],
    default:'applicant'
 },


 resume:{
    type:String,
},

//  isBloked:{
//     type:Boolean,
//     default:false
//  },


},{
    timestamps:true
}
)



export const User = mongoose.model("User",userSchema);