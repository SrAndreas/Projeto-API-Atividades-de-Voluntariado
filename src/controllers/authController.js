const db = require('../models/db');
const { generateToken } = require('../utils/auth');
const config = require('../config');

const register = async (req, res) => {
    const { email, password } = req.body;

    // Verifica se o e-mail já está cadastrado
    db.get(email, (err, value) => {
        if (!err) {
            return res.status(400).json({ message: 'E-mail já cadastrado.' });
        }

        // Salva o usuário no banco de dados
        db.put(email, JSON.stringify({ email, password, role: 'user' }), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
            }
            res.status(201).json({ message: 'Usuário cadastrado com sucesso.' });
        });
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    // Busca o usuário no banco de dados
    db.get(email, (err, value) => {
        if (err) {
            return res.status(400).json({ message: 'E-mail ou senha inválidos.' });
        }

        const user = JSON.parse(value);
        if (user.password !== password) {
            return res.status(400).json({ message: 'E-mail ou senha inválidos.' });
        }

        // Gera o token JWT
        const token = generateToken({ id: email, role: user.role });
        res.json({ token });
    });
};

const refreshToken = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: 'Token não fornecido.' });

    try {
        const decoded = jwt.verify(token, config.secretKey);
        const newToken = generateToken({ id: decoded.id, role: decoded.role });
        res.json({ token: newToken });
    } catch (error) {
        res.status(400).json({ message: 'Token inválido.' });
    }
};

module.exports = { register, login, refreshToken };