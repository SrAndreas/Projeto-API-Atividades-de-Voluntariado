const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
    return password.length >= 6;
};

const validateRegister = (req, res, next) => {
    const { email, password } = req.body;

    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'E-mail inválido.' });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!validateEmail(email) || !password) {
        return res.status(400).json({ message: 'E-mail ou senha inválidos.' });
    }

    next();
};

module.exports = { validateRegister, validateLogin };