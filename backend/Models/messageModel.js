const mongoose = require('mongoose')
const { Schema, model, models, Types } = mongoose;

const messageSchema = new Schema({
    content: String,
    sender: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    chatId: {
        type: Types.ObjectId,
        ref: "Chat",
        required: true
    },
    attachments: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

module.exports = models.Message || model('Message', messageSchema)