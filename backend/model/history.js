const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    reference: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'referenceModel',
    },
    referenceModel: {
        type: String,
        enum: ['Order', 'Product'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const History = mongoose.model('History', historySchema);
module.exports = History;
