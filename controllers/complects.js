const { ComplectModel } = require('../models/Complect');

/**
 * @route GET api/complect
 * @desc Получение всех комплектов
 * @private Public
 */
const all = async (req, res) => {
    try {
        const complects = await ComplectModel.find().populate({ path: 'composition', populate: { path: 'component' } }).exec();

        res.status(200).json(complects);
    } catch (error) {
        res.status(500).json({ message: 'Не удалось получить список комплектов' })
    }
}

/**
 * @route POST api/complect/add
 * @desc Добавление комплекта
 * @private Private
 */
const add = async (req, res) => {
    try {
        const data = req.body;

        if (!data.name || !data.article || !data.composition) {
            return res.status(400).json({ message: 'Заполните обязательные поля' });
        }

        const doc = new ComplectModel({
            name: data.name,
            article: data.article,
            count: data.count,
            composition: data.composition,
        });

        const complect = await doc.save();

        res.status(201).json(complect);
    } catch (error) {
        res.status(500).json({ message: 'Не удалось создать новый компонент' })
    }
}

/**
 * @route POST api/complect/remove/:id
 * @desc Удаление комплекта
 * @private Private
 */
const remove = async (req, res) => {
    try {
        const { id } = req.body;

        await ComplectModel.findOneAndDelete({ _id: id })

        res.status(204).json('Комплект удален');
    } catch {
        res.status(500).json({ message: 'Не удалось удалить комплект' });
    }
}

/**
 * @route PUT api/complect/edit/:id
 * @desc Редактирование комплект
 * @private Private
 */
const edit = async (req, res) => {
    try {
        const data = req.body;

        await ComplectModel.updateOne(
            {
                _id: data._id
            },
            {
                name: data.name,
                article: data.article,
                count: data.count,
                composition: data.composition,
            }
        )

        res.status(204).json('Компонент изменен');
    } catch {
        res.status(500).json({ message: 'Не удалось редактировать компонент' });
    }
}

/**
 * @route GET api/complect/:id
 * @desc Получение комплекта
 * @private Public
 */
const complect = async (req, res) => {
    try {
        const { id } = req.params;

        const complect = await ComplectModel.findOne({ _id: id }).populate({ path: 'composition', populate: { path: 'component' } }).exec();

        res.status(200).json(complect);
    } catch {
        res.status(500).json({ message: 'Не удалось получить комплект' });
    }
}

module.exports = {
    all,
    add,
    remove,
    edit,
    complect
}