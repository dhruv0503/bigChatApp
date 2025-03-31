const mongoose = require('mongoose');
const {Types, Schema, model, models} = mongoose;

const requestSchema = Schema({
    sender: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
})

module.exports = models.Request || model('Request', requestSchema)