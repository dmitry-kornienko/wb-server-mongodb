const mongoose = require('mongoose');

const SendOperationSchema = new mongoose.Schema({
    sendingData: {
        type: String,
        required: true,
    },
    isPacked: {
        type: Boolean,
        required: true,
        default: false,
    },
    isSended: {
        type: Boolean,
        required: true,
        default: false,
    },
    warehous: {
        type: String,
        required: true,
    },
    sendNumberMP: String,
    invoiceNumber: String,
    partCount: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        default: 0,
    },
    acceptDate: {
        type: String,
        required: true,
    },
    isAgreed: {
        type: Boolean,
        required: true,
        default: false,
    },
    isAccepted: {
        type: Boolean,
        required: true,
        default: false,
    },
    composition: [{
        complect: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Complect',
        },
        count: Number,
    }],
});

const SendOperationModel = mongoose.model('SendOperation', SendOperationSchema);

module.exports = {
    SendOperationModel
}