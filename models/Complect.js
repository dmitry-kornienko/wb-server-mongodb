const mongoose = require('mongoose');

const ComplectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    article: {
        type: String,
        required: true,
        unique: true,
    },
    count: {
        type: Number,
        default: 0
    },
    composition: [{
        component: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Component',
        },
        count: Number,
    }],
    costPrice: {
        type: Number,
        default: 0
    },
});

const ComplectModel = mongoose.model('Complect', ComplectSchema);

module.exports = {
    ComplectModel
}