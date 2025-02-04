const multer = require('multer')

const multerUpload = multer({
    storage : multer.memoryStorage(),
    limits : {
        fileSize : 1024 * 1024 * 5
    }
})

module.exports.singleFileUpload = multerUpload.single('avatar')

module.exports.attachmentUpload = multerUpload.array('files', 5)
