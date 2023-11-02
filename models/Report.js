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
    delivery_rub: Number, 
    penalty: Number,
    storage_cost: Number, // хранение
    other_deductions: Number, // прочие удержания
    composition: [{
        article: String,
        count: Number,
        return_count: Number
    }]
});

const ReportModel = mongoose.model('Report', ReportSchema);

module.exports = {
    ReportModel
}