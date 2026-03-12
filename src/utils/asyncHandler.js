//global response and error handler for every feature
//using promice .then
//1st approch

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};




export {asyncHandler}








//using  try catch
// 2nd approch

// steps for understanding this function

//const asyncHandler = () => {}
//const asyncHnadler = (func) => () =>{}
//const asyncHnadler = (func) => async() =>{}



// const asyncHandler = (fn) => async(err , req, res, next) => {
//     try{
//       return  await fn(err, req, res, next)
//     }
//     catch(error){
//         res.status(error.code || 500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }

