const { ComponentModel } = require('../models/Component');

/**
 * @route GET api/component
 * @desc Получение всех компонентов
 * @private Public
 */
const all = async (req, res) => {
    try {
        const components = await ComponentModel.find();
        res.status(200).json(components);
    } catch (error) {
        res.status(500).json({ message: 'Не удалось получить список компонентов' });
    }
}

/**
 * @route POST api/component/add
 * @desc Добавление компонента
 * @private Private
 */
const add = async (req, res) => {
    try {
        const data = req.body;

        if (!data.name || !data.article || !data.price) {
            return res.status(400).json({ message: 'Заполните обязательные поля' });
        }

        const doc = new ComponentModel({
            name: req.body.name,
            article: req.body.article,
            count: req.body.count,
            price: req.body.price,
            desc: req.body.desc,
        });

        const component = await doc.save();

        res.status(201).json(component);
    } catch (error) {
        res.status(500).json({ message: 'Не удалось создать новый компонент' });
    }
}

/**
 * @route POST api/component/remove/:id
 * @desc Удаление компонента
 * @private Private
 */
const remove = async (req, res) => {
    try {
        const { id } = req.body;

        await ComponentModel.findOneAndDelete({
            _id: id,
        });

        res.status(204).json('Компонент удален');
    } catch {
        res.status(500).json({ message: 'Не удалось удалить компонент' });
    }
}

/**
 * @route PUT api/component/edit/:id
 * @desc Редактирование компонента
 * @private Private
 */
const edit = async (req, res) => {
    try {
        const data = req.body;
        const id = data._id;
        
        await ComponentModel.updateOne(
            {
                _id: id,
            },
            {
                name: req.body.name,
                article: req.body.article,
                count: req.body.count,
                price: req.body.price,
                desc: req.body.desc,
            }
        );

        res.status(204).json('Компонент изменен');
    } catch {
        res.status(500).json({ message: 'Не удалось редактировать компонент' });
    }
}

/**
 * @route GET api/component/:id
 * @desc Получение компонента
 * @private Public
 */
const component = async (req, res) => {
    try {
        const { id } = req.params;

        const component = await ComponentModel.findOne({ _id: id });

        if (!component) {
            return res.status(404).json({ message: 'Не удалось получить компонент' });
        }

        res.status(200).json(component);
    } catch {
        res.status(500).json({ message: 'Не удалось получить компонент' });
    }
}

module.exports = {
    all,
    add,
    remove,
    edit,
    component
}