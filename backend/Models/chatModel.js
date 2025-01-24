const mongoose = require('mongoose')
const { Schema, model, models, Types } = mongoose;
const chatSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    groupChat: {
        type: Boolean,
        default: false
    },
    creator: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: Types.ObjectId,
        ref: 'User',
        required: true
    }]
}, {
    timestamps: true
})

module.exports = models.Chat || model('Chat', chatSchema)