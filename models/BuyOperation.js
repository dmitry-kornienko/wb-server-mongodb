const mongoose = require('mongoose');

const BuyOperationSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    composition: [{
        component: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Component',
        },
        count: Number,
        price: Number,
    }],
});

const BuyOperationModel = mongoose.model('BuyOperation', BuyOperationSchema);

module.exports = {
    BuyOperationModel
}