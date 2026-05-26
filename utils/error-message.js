
const internalServerError = (error, res) => {
    console.log(error);
    res.status(500).json({status: "error", message: "Something went wrong!  Please try again"});
};



module.exports = {
    internalServerError
}