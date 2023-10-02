const mongoose = require('mongoose');

const ComponentSchema = new mongoose.Schema({
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
    price: {
        type: Number,
        required: true,
    },
    desc: String,
});

const ComponentModel = mongoose.model('Component', ComponentSchema);

module.exports = {
    ComponentModel
}