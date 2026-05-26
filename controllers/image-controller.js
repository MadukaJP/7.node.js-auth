const fs = require("fs");
const Image = require("../models/Image");
const {uploadToCloudinary} = require("../utils/cloudinary");
const {internalServerError} = require("../utils/error-message");
const cloudinary = require("../config/cloudinary");
const {default: mongoose} = require("mongoose");


const getAllImagesController = async (req, res) => {

    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5

        if ((page < 1) || (limit < 1)) {
            return res.status(400).json({status: "error", message: "Provide valid values for page and limit"})
        }
        const skip = (page - 1) * limit
        const sortBy = req.query.sort_by || 'createdAt'
        const sortOrder = req.query.sort_order === 'asc' ? 1 : -1

        const sortObj = {}
        sortObj[sortBy] = sortOrder

        const allImages = await Image.find({}).sort(sortObj).skip(skip).limit(limit);
        const count = await Image.countDocuments();
        const maxPages = Math.ceil(count / limit)

        if (page > maxPages) {
            return res.status(400).json({status: "error", message: "Invalid page! Please provide a valid page"})
        }

        res.status(200).json({
            status: "success",
            page: page,
            max_pages: maxPages,
            count: count,
            data: allImages
        });
    } catch (error) {
        internalServerError(error, res)
    }
}


const uploadImageController = async (req, res) => {
    if (!req.file) {
        return res.status(400).json('File is required! Please upload an image')
    }
    console.log("Uploading image...");
    try {

        const {url, publicId} = await uploadToCloudinary(req.file.path)

        const newImage = new Image({url, publicId, uploadedBy: req.userInfo.userId})

        await newImage.save()

        console.log("Image uploaded!");

        fs.unlinkSync(req.file.path);

        return res.status(201).json({status: "success", message: "Image uploaded succesfully!", image: newImage})


    } catch (error) {
        internalServerError(error, res)
    }
}

const deleteImageController = async (req, res) => {
    try {

        const imageId = req.params.id
        const userId = req.userInfo.userId

        if (! imageId) {
            return res.status(400).json({status: "error", message: "Image ID is required!"})
        }

        if (!mongoose.Types.ObjectId.isValid(imageId)) {
            return res.status(400).json({status: "error", message: "Invalid image ID! Please provide a valid ID"})
        }

        const image = await Image.findById(imageId)

        if (! image) {
            return res.status(404).json({status: "error", message: "Image not found, please provided qa valid image ID"})
        }

        const isOwner = image.uploadedBy.toString() === userId

        if (! isOwner) {
            return res.status(403).json({status: "error", message: "Not authorized! You can't delete images uploaded by other users "})
        }

        console.log('Deleting Image...');

        await cloudinary.uploader.destroy(image.publicId)

        await Image.findByIdAndDelete(imageId)

        console.log('Image deleted successfully!');

        return res.status(200).json({status: "success", message: 'Image deleted successfully'})

    } catch (error) {
        internalServerError(error, res)
    }
}


module.exports = {
    getAllImagesController,
    uploadImageController,
    deleteImageController
}
