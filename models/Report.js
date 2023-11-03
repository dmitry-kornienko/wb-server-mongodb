const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    realizationreport_id: {
        type: Number,
        unique: true,
    },
    date_from: String, 
    date_to: String,
    retail_amount: Number, // оборот
    ppvz_for_pay: Number, // к перечислению за товар
    cost_price: Number, // себестоимость товаров
    delivery_rub: Number, 
    penalty: Number,
    storage_cost: Number,
    other_deductions: Number,
    composition: [{
        article: String,
        count: Number,
        return_count: Number,
        cost_price_of_one: Number,
        ppvz_for_pay_for_article: Number
    }]
});

const ReportModel = mongoose.model('Report', ReportSchema);

module.exports = {
    ReportModel
}