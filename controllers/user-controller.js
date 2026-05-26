const User = require("../models/User");
const { internalServerError } = require("../utils/error-message");


const getAllUsersController = async (req, res) => {
    try {
        const allUsers = await User.find({}).select('-password -__v');
        const count = await User.countDocuments();
        res.status(200).json({status: "success", count: count, data: allUsers});
    } catch (error) {
        internalServerError(error, res);
    }
};



module.exports = {
    getAllUsersController
}