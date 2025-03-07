const express = require('express');
const path = require('path');

const app = express();

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Outras rotas da API
const authRoutes = require('./src/routes/auth');
const activityRoutes = require('./src/routes/activity');
app.use('/auth', authRoutes);
app.use('/activities', activityRoutes);

module.exports = app;