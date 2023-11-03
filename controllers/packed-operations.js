const { PackedOperationModel } = require('../models/PackedOperation');
const { ComplectModel } = require('../models/Complect');
const { ComponentModel } = require('../models/Component');

/**
 * @route GET api/packed-operation
 * @desc Получение всех операцй упаковки
 * @private Public
 */
const all = async (req, res) => {
    try {
        const packedOperaions = await PackedOperationModel.find().populate('complect').exec();

        packedOperaions.sort((a, b) => {
            const aDateNumber = Number(a.date.split('-').join(''));
            const bDateNumber = Number(b.date.split('-').join(''));
            return bDateNumber - aDateNumber;
         })

        res.status(200).json(packedOperaions);
    } catch (error) {
        res.status(500).json({ message: 'Не удалось получить список операций упаковок' });
    }
}

/**
 * @route POST api/packed-operation/add
 * @desc Добавление операции упаковки
 * @private Private
 */
const add = async (req, res) => {
    try {
        const data = req.body;
        
        if (!data.date || !data.count || !data.complect) {
            return res.status(400).json({ message: 'Заполните все поля' });
        }

        const doc = new PackedOperationModel({
            date: data.date,
            complect: data.complect,
            count: data.count,
        });

        const packedOperation = await doc.save();

        const complect = await ComplectModel.findOneAndUpdate(
            { _id: data.complect },
            { $inc: { count: data.count } },
            { returnDocument: 'after', }
        ).populate({ path: 'composition', populate: { path: 'component' } }).exec();
        
        complect.composition.forEach(async item => {
            await ComponentModel.findOneAndUpdate({
                _id: item.component,
            }, {
                $inc: { count: -(item.count * data.count) }
            });
        });

        res.status(201).json(packedOperation);
    } catch (error) {
        res.status(500).json({ message: 'Не удалось создать новую операцию упаковки' });
    }
}

/**
 * @route POST api/packed-operation/remove/:id
 * @desc Удаление операции упаковки
 * @private Private
 */
const remove = async (req, res) => {
    try {
        const { id } = req.body;

        const packedOperation = await PackedOperationModel.findOne({ _id: id }).populate('complect').exec();
        
        const complect = await ComplectModel.findOneAndUpdate(
            { _id: packedOperation.complect.id },
            { $inc: { count: -packedOperation.count } },
            { returnDocument: 'after', }
        ).populate({ path: 'composition', populate: { path: 'component' } }).exec();
        
        complect.composition.forEach(async item => {
            await ComponentModel.findOneAndUpdate({
                _id: item.component,
            }, {
                $inc: { count: (item.count * packedOperation.count) }
            });
        });
        
        await PackedOperationModel.findOneAndDelete({ _id: id });
        
        res.status(204).json('Операция удалена');
    } catch {
        res.status(500).json({ message: 'Не удалось удалить операцию' });
    }
}

/**
 * @route PUT api/packed-operation/edit/:id
 * @desc Редактирование операции упаковки
 * @private Private
 */
const edit = async (req, res) => {
    try {
        const data = req.body;

        const packedOperation = await PackedOperationModel.findOne({ _id: data._id });
        
        const complect = await ComplectModel.findOneAndUpdate(
            { _id: packedOperation.complect._id },
            { $inc: { count: -packedOperation.count } },
            { returnDocument: 'after' }
        ).populate({ path: 'composition', populate: { path: 'component' } }).exec();

        complect.composition.forEach(async item => {
            await ComponentModel.findOneAndUpdate({
                _id: item.component,
            }, {
                $inc: { count: (item.count * packedOperation.count) }
            });
        });

        await ComplectModel.findOneAndUpdate(
            { _id: data.complect },
            { $inc: { count: data.count } },
            { returnDocument: 'after', }
        ).populate({ path: 'composition', populate: { path: 'component' } }).exec();

        complect.composition.forEach(async item => {
            await ComponentModel.findOneAndUpdate({
                _id: item.component,
            }, {
                $inc: { count: -(item.count * data.count) }
            });
        });

        await PackedOperationModel.updateOne(
            { _id: data._id },
            {  
                date: data.date,
                complect: data.complectId,
                count: data.count,
            }
        );

        res.status(204).json('Операция изменена');
    } catch {
        res.status(500).json({ message: 'Не удалось редактировать операцию' });
    }
}

/**
 * @route GET api/packed-operation/:id
 * @desc Получение операции упаковки
 * @private Public
 */
const packedOperation = async (req, res) => {
    try {
        const { id } = req.params;

        const packedOperation = await PackedOperationModel.findOne({ _id: id }).populate('complect').exec();

        res.status(200).json(packedOperation);
    } catch {
        res.status(500).json({ message: 'Не удалось получить данные операции упаковки' });
    }
}

module.exports = {
    all,
    add,
    remove,
    edit,
    packedOperation
}