const multer = require('multer')
const path = require('path')


// multer storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename : function (req, file, cb) {
        const filename = file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        cb(null, 
            filename
        )
    }
})


// file filter 
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new Error('Not an image! please upload only image'))
    }
}


const FILE_SIZE = 5 * 1024 * 1024  // 5 MB


module.exports = multer({
    storage: storage,
    fileFilter,
    limits: {
        fileSize: FILE_SIZE
    }
})