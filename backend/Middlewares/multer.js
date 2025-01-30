const multer = require('multer')

const multerUpload = multer({
    storage : multer.memoryStorage(),
    limits : {
        fileSize : 1024 * 1024 * 5
    }
})

const singleFileUpload = multerUpload.single('avatar')

const attachmentUpload = multerUpload.array('files', 5)

module.exports = {singleFileUpload, attachmentUpload}
