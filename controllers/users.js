const { prisma } = require('../prisma/prisma-client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/User');

/**
 * @route POST /api/user/login
 * @desc Логин
 * @access Public
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Пожалуйста, заполните обязательные поля' });
        }

        const user = await UserModel.findOne({ email: req.body.email });
        const isPasswordCorrect = user && (await bcrypt.compare(password, user.password));
        const secret = process.env.JWT_SECRET;

        if (user && isPasswordCorrect && secret) {
            res.status(200).json({
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                token: jwt.sign({ _id: user._id }, secret, { expiresIn: '30d' })
            })
        } else {
            return res.status(400).json({ message: 'Неверный логин или пароль' });
        }
    } catch {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
}

 /**
* @route POST /api/user/register
* @desc Регситрация
* @access Public
*/
const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ message: 'Заполните все поля' })
        }

        const registeredUser = await UserModel.findOne({ email: req.body.email });
        
        if (registeredUser) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }
        // строка для усиления безопасности пароля
        const salt = await bcrypt.genSalt(10);
        // делаем хэш пароля для хранения в БД
        const hashedPassword = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hashedPassword,
        });

        const user = await doc.save();
        const secret = process.env.JWT_SECRET;

        if (user && secret) {
            res.status(201).json({
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                token: jwt.sign({ _id: user._id }, secret, { expiresIn: '30d' })
            })
        } else {
            return res.status(400).json({ message: 'Не удалось создать пользователя' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
}

 /**
* @route GET /api/user/current
* @desc Текущий пользователь
* @access Private
*/
const current = async (req, res) => {
    res.status(200).json(req.user);
}

module.exports = {
    login,
    register,
    current
}