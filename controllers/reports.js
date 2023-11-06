const { ComplectModel } = require('../models/Complect');
const { ReportModel } = require('../models/Report');
const axios = require('axios').default;

/**
 * @route GET api/report
 * @desc Получение всех отчетов
 * @private Public
 */
const all = async (req, res) => {
    try {
        const reports = await ReportModel.find();

        reports.sort((a, b) => {
            const aDateNumber = Number(a.date_from.split('-').join(''));
            const bDateNumber = Number(b.date_from.split('-').join(''));
            return bDateNumber - aDateNumber;
        });

        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Не удалось получить список отчетов' });
    }
}

/**
 * @route POST api/report/add
 * @desc Добавление отчета
 * @private Private
 */
const add = async (req, res) => {
    try {
        const {dateFrom, dateTo, tokenWB} = req.body
        const config = {
            method: 'get',
            url: `https://statistics-api.wildberries.ru/api/v1/supplier/reportDetailByPeriod?dateFrom=${dateFrom}&dateTo=${dateTo}`,
            headers: {
              'Authorization': tokenWB
            },
        };

        const complects = await ComplectModel.find();
        const response = await axios(config);

        const addedReport = await ReportModel.findOne({ realizationreport_id: response.data[0].realizationreport_id });

        if (addedReport) {
            return res.status(400).json({ message: 'Отчет с таким ID уже существует' });
        }

        const getCostPriceOfReport = (reportComposition) => {
            let sum = 0
            reportComposition.forEach(el => {
                const complect = complects.find(i => i.article == el.article);
                sum += complect.costPrice * el.count
            })
            return sum
        }

        const report = {
            realizationreport_id: response.data[0].realizationreport_id,
            date_from: dateFrom,
            date_to: dateTo,
            retail_amount: 0, // оборот
            ppvz_for_pay: 0, // к перечислению за товар
            cost_price: 0, // себестоимость товаров
            delivery_rub: 0,
            penalty: 0,
            storage_cost: 0,
            other_deductions: 0,
            composition: []
        }

        const getGoodCount = (article) => {
            let count = 0
            response.data.forEach(item => {
                if (item.supplier_oper_name == "Продажа" && item.sa_name == article) {
                    count += 1
                }
            })
            return count
        }
        const getGoodReturnCount = (article) => {
            let count = 0;
            response.data.forEach(item => {
                if (item.sa_name == article && item.doc_type_name == "Возврат" && item.supplier_oper_name == "Возврат") {
                    count += 1
                }
            })
            return count
        }
        const getPpvzForPayForArticle = (article) => {
            let sum = 0;
            response.data.forEach(item => {
                if (item.supplier_oper_name == "Продажа" && item.sa_name == article) {
                    sum +=item.ppvz_for_pay
                }
            });
            return sum.toFixed(2)
        }

        response.data.forEach(row => {
            if (row.supplier_oper_name == "Логистика") {
                report.delivery_rub += row.delivery_rub
            }
            if (row.supplier_oper_name == "Продажа") {
                report.retail_amount += row.retail_amount
                report.ppvz_for_pay += row.ppvz_for_pay
                report.penalty += row.penalty
            }
            if (!report.composition.find(i => i.article == row.sa_name) && row.supplier_oper_name == "Продажа") {
                const complect = complects.find(i => i.article == row.sa_name)
                report.composition.push({
                    article: row.sa_name,
                    count: getGoodCount(row.sa_name),
                    return_count: getGoodReturnCount(row.sa_name),
                    cost_price_of_one: complect.costPrice,
                    ppvz_for_pay_for_article: getPpvzForPayForArticle(row.sa_name)
                })
            }
        })

        report.cost_price = getCostPriceOfReport(report.composition);
        report.penalty = response.data.reduce((sum, el) => sum + el.penalty, 0);
        report.delivery_rub = report.delivery_rub.toFixed(2);
        
        const doc = new ReportModel(report);

        const reportForDB = await doc.save();

        res.status(200).json(reportForDB);
      } catch (error) {
        if (error.name == 'AxiosError') {
            return res.status(401).json({ message: 'Неактуальный токен WB' });
        }
        res.status(500).json(error);
      }
}

/**
 * @route POST api/report/remove/:id
 * @desc Удаление отчета
 * @private Private
 */
const remove = async (req, res) => {
    try {
        const { id } = req.body;

        await ReportModel.findOneAndDelete({
            _id: id,
        });

        res.status(204).json({ message: 'Отчет удален' });
    } catch {
        res.status(500).json({ message: 'Не удалось удалить отчет' });
    }
}

/**
 * @route PATCH api/report/edit/:id
 * @desc Редактирование отчета
 * @private Private
 */
const edit = async (req, res) => {
    try {
        const { id, storage_cost, other_deductions } = req.body;
        await ReportModel.findOneAndUpdate(
            {
                _id: id,
            },
            {
                $set: {
                    storage_cost,
                    other_deductions
                }
            }
        );

        res.status(204).json('Отчет изменен');
    } catch {
        res.status(500).json({ message: 'Не удалось редактировать отчет' });
    }
}

/**
 * @route GET api/report/:id
 * @desc Получение отчета
 * @private Public
 */
const report = async (req, res) => {
    try {
        const { id } = req.params;

        const report = await ReportModel.findOne({ _id: id });

        if (!report) {
            return res.status(404).json({ message: 'Не удалось получить отчет' });
        }

        res.status(200).json(report);
    } catch {
        res.status(500).json({ message: 'Не удалось получить отчет' });
    }
}

module.exports = {
    all,
    add,
    remove,
    report,
    edit
}