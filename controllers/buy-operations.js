const { BuyOperationModel } = require('../models/BuyOperation');
const { ComponentModel } = require('../models/Component');
/**
 * @route GET api/buy-operation
 * @desc Получение всех операцй закупок
 * @private Public
 */
const all = async (req, res) => {
    try {
        const buyOperations = await BuyOperationModel.find().populate({ path: 'composition', populate: { path: 'component' } }).exec();

        buyOperations.sort((a, b) => {
            const aDateNumber = Number(a.date.split('-').join(''));
            const bDateNumber = Number(b.date.split('-').join(''));
            return bDateNumber - aDateNumber;
        });

        res.status(200).json(buyOperations);
    } catch (error) {
        res.status(500).json({ message: 'Не удалось получить список операций закупок' });
    }
}

/**
 * @route POST api/buy-operation/add
 * @desc Добавление операции закупки
 * @private Private
 */
const add = async (req, res) => {
    try {
        const data = req.body;

        if (!data.date || !data.composition) {
            return res.status(400).json({ message: 'Заполните обязательные поля' });
        }

        const doc = new BuyOperationModel({
            date: data.date,
            composition: data.composition,
        });

        const buyOperation = await doc.save();

        data.composition.forEach(async item => {
            await ComponentModel.findOneAndUpdate({
                _id: item.component
            }, {
                $inc: { count: item.count },
                price: item.price,
            });
        });

        res.status(201).json(buyOperation);
    } catch (error) {
        res.status(500).json({ message: 'Не удалось создать новую операцию закупки' });
    }
}

/**
 * @route POST api/buy-operation/remove/:id
 * @desc Удаление операции закупки
 * @private Private
 */
const remove = async (req, res) => {
    try {
        const { id } = req.body;

        const buyOperation = await BuyOperationModel.findOne({ _id: id }).populate({ path: 'composition', populate: { path: 'component' } }).exec();
        
        buyOperation.composition.forEach(async item => {
            await ComponentModel.findOneAndUpdate({
                _id: item.component
            }, {
                $inc: { count: -item.count }
            });
        });

        await BuyOperationModel.findOneAndDelete({ _id: id });

        res.status(204).json('Операция удалена');
    } catch {
        res.status(500).json({ message: 'Не удалось удалить операцию' });
    }
}

/**
 * @route PUT api/buy-operation/edit/:id
 * @desc Редактирование операции закупки
 * @private Private
 */
const edit = async (req, res) => {
    try {
        const data = req.body;

        const operationBeforeUpdate = await BuyOperationModel.findOne({ _id: data._id });

        operationBeforeUpdate.composition.forEach(async item => {
            await ComponentModel.findOneAndUpdate({
                _id: item.component
            }, {
                $inc: { count: -item.count }
            });
        });

        data.composition.forEach(async item => {
            await ComponentModel.findOneAndUpdate({
                _id: item.component._id
            }, {
                $inc: { count: item.count },
                price: item.price
            });
        });

        await BuyOperationModel.updateOne(
            {
                _id: data._id
            },
            {
                date: data.date,
                composition: data.composition,
            }
        )

        res.status(204).json('Операция изменена');
    } catch {
        res.status(500).json({ message: 'Не удалось редактировать операцию' });
    }
}

/**
 * @route GET api/buy-operation/:id
 * @desc Получение операции закупки
 * @private Public
 */
const buyOperation = async (req, res) => {
    try {
        const { id } = req.params;

        const buyOperation = await BuyOperationModel.findOne({ _id: id }).populate({ path: 'composition', populate: { path: 'component' } }).exec();

        res.status(200).json(buyOperation);
    } catch {
        res.status(500).json({ message: 'Не удалось получить данный операции' });
    }
}

module.exports = {
    all,
    add,
    remove,
    edit,
    buyOperation
}