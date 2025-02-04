module.exports.globalError = (err, req, res, next) => {
    // console.log(err)
    const { statusCode = 500 } = err;
    //Duplicate Key Error Mongo
    if(err.code === 11000){
        const field = Object.keys(err.keyValue).join(", ")
        err.message = `${field} already exists`
        err.statusCode = 400
    }

    //Invalid ID
    if(err.name === "CastError"){
        err.message = "Invalid ID",
        err.statusCode = 400
    }
    if (!err.message) err.message = 'Internal Server Error';
    res.status(statusCode).json({
        error: {
            message: process.env.NODE_ENV.trim() === "DEVELOPMENT" ? err : err.message,
            status: err.statusCode
        }
    });
}