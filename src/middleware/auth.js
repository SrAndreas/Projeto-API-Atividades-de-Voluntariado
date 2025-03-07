const { verifyToken } = require('../utils/auth');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });

    try {
        const decoded = verifyToken(token);
        req.userId = decoded.id;
        req.userRole = decoded.role; // Adiciona a role do usuário ao request
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token inválido.' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado. Permissão de administrador necessária.' });
    }
    next();
};

module.exports = { authMiddleware, isAdmin };