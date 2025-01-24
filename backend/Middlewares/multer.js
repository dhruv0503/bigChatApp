const multer = require('multer')

const multerUpload = multer({
    limits : {
        fileSize : 1024 * 1024 * 5
    }
})

const singleFileUpload = multerUpload.single('avatar')

module.exports = {singleFileUpload}
