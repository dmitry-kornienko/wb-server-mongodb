const mongoose = require('mongoose');

const PackedOperationSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    complect: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complect',
        required: true,
    },
    count: {
        type: Number,
        required: true,
    },
});

const PackedOperationModel = mongoose.model('PackedOperation', PackedOperationSchema);

module.exports = {
    PackedOperationModel
}