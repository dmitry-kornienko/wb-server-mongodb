const { SendOperationModel } = require('../models/SendOperation');
const { ComplectModel } = require('../models/Complect');

/**
 * @route GET api/send-operation
 * @desc Получение всех поставок
 * @private Public
 */
const all = async (req, res) => {
    try {
        const sendOperations = await SendOperationModel.find().populate({ path: 'composition', populate: { path: 'complect' } }).exec();

        sendOperations.sort((a, b) => {
            const aDateNumber = Number(a.sendingData.split("-").join(""));
            const bDateNumber = Number(b.sendingData.split("-").join(""));
            return bDateNumber - aDateNumber;
        });

        res.status(200).json(sendOperations);
    } catch (error) {
        res.status(500).json({
            message: "Не удалось получить список поставок",
        });
    }
};

/**
 * @route POST api/send-operation/add
 * @desc Добавление поставки
 * @private Private
 */
const add = async (req, res) => {
    try {
        const data = req.body;

        if (!data.sendingData || !data.warehous || !data.partCount || !data.acceptDate || !data.composition) {
            return res.status(400).json({ message: "Заполните обязательные поля" });
        }

        const doc = new SendOperationModel({
            sendingData: data.sendingData,
            warehous: data.warehous,
            sendNumberMP: data.sendNumberMP,
            partCount: data.partCount,
            weight: 0,
            acceptDate: data.acceptDate,
            composition: data.composition,
        });

        const sendOperation = await doc.save();

        res.status(201).json(sendOperation);
    } catch (error) {
        res.status(500).json({ message: "Не удалось создать поставку" });
    }
};

/**
 * @route POST api/send-operation/remove/:id
 * @desc Удаление поставки
 * @private Private
 */
const remove = async (req, res) => {
    try {
        const { id } = req.body;

        const sendOperation = await SendOperationModel.findOne({ _id: id }).populate({ path: 'composition', populate: { path: 'complect' } }).exec();

        if (sendOperation.isSended) {
            return res.status(500).json({
                message: 'Нельзя удалить ОТПРАВЛЕННУЮ поставку',
            });
        }

        await SendOperationModel.findOneAndDelete({ _id: id });

        res.status(204).json("Поставка удалена");
    } catch {
        res.status(500).json({ message: "Не удалось удалить поставку" });
    }
};

/**
 * @route PUT api/send-operation/edit/:id
 * @desc Редактирование поставки
 * @private Private
 */
const edit = async (req, res) => {
    try {
        const data = req.body;

        const operationBeforeUpdate = await SendOperationModel.findOne({ _id: data._id });

        if (data.isSended & !operationBeforeUpdate.isSended) {
            data.composition.forEach(async item => {
                await ComplectModel.findOneAndUpdate(
                    { _id: item.complect },
                    { $inc: { count: -item.count } },
                );
            });
        }

        if (!data.isSended & operationBeforeUpdate.isSended) {
            operationBeforeUpdate.composition.forEach(async item => {
                await ComplectModel.findOneAndUpdate(
                    { _id: item.complect },
                    { $inc: { count: item.count } },
                );
            });
        }

        await SendOperationModel.updateOne(
            { _id: data._id },
            {
                sendingData: data.sendingData,
                warehous: data.warehous,
                sendNumberMP: data.sendNumberMP,
                invoiceNumber: data.invoiceNumber,
                partCount: data.partCount,
                weight: data.weight,
                acceptDate: data.acceptDate,
                isPacked: data.isPacked,
                isSended: data.isSended,
                isAgreed: data.isAgreed,
                isAccepted: data.isAccepted,
                composition: data.composition,
            }
        );

        res.status(204).json("Поставка изменена");
    } catch {
        res.status(500).json({ message: "Не удалось редактировать поставку" });
    }
};

/**
 * @route GET api/send-operation/:id
 * @desc Получение поставки
 * @private Public
 */
const sendOperation = async (req, res) => {
    try {
        const { id } = req.params;

        const sendOperation = await SendOperationModel.findOne({ _id: id }).populate({ path: 'composition', populate: { path: 'complect' } });

        res.status(200).json(sendOperation);
    } catch {
        res.status(500).json({
            message: "Не удалось получить данные поставки",
        });
    }
};

module.exports = {
    all,
    add,
    remove,
    edit,
    sendOperation,
};
