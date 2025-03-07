const db = require('../models/db');

// Listar atividades
const listActivities = async (req, res) => {
    const activities = [];
    const iterator = db.iterator();

    const fetchNext = () => {
        iterator.next((err, key, value) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao listar atividades.' });
            }

            if (key && value) {
                try {
                    const activity = JSON.parse(value);
                    activities.push(activity);
                    fetchNext();
                } catch (error) {
                    fetchNext();
                }
            } else {
                res.json(activities);
            }
        });
    };

    fetchNext();
};

// Criar atividade
const createActivity = async (req, res) => {
    const { title, description, date, location, maxParticipants } = req.body;

    const activity = {
        id: Date.now(),
        title,
        description,
        date,
        location,
        maxParticipants,
        participants: []
    };

    db.put(activity.id, JSON.stringify(activity), (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao criar atividade.' });
        }
        res.status(201).json(activity);
    });
};

// Inscrever-se em uma atividade
const registerForActivity = async (req, res) => {
    const activityId = req.params.id;
    const userId = req.userId; // Obtém o ID do usuário do token JWT

    db.get(activityId, (err, value) => {
        if (err) {
            return res.status(404).json({ message: 'Atividade não encontrada.' });
        }

        const activity = JSON.parse(value);

        if (activity.participants && activity.participants.length >= activity.maxParticipants) {
            return res.status(400).json({ message: 'Não há vagas disponíveis.' });
        }

        if (!activity.participants) {
            activity.participants = [];
        }
        activity.participants.push(userId);

        db.put(activityId, JSON.stringify(activity), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao se inscrever na atividade.' });
            }
            res.json({ message: 'Inscrição realizada com sucesso.', activity });
        });
    });
};

// Cancelar inscrição
const cancelRegistration = async (req, res) => {
    const activityId = req.params.id;
    const userId = req.userId;

    db.get(activityId, (err, value) => {
        if (err) {
            return res.status(404).json({ message: 'Atividade não encontrada.' });
        }

        const activity = JSON.parse(value);

        if (activity.participants) {
            activity.participants = activity.participants.filter(id => id !== userId);
        }

        db.put(activityId, JSON.stringify(activity), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao cancelar inscrição.' });
            }
            res.json({ message: 'Inscrição cancelada com sucesso.', activity });
        });
    });
};

// Listar participantes de uma atividade
const listParticipants = async (req, res) => {
    const activityId = req.params.id;

    db.get(activityId, (err, value) => {
        if (err) {
            return res.status(404).json({ message: 'Atividade não encontrada.' });
        }

        const activity = JSON.parse(value);
        res.json({ participants: activity.participants || [] });
    });
};

// Exportar funções
module.exports = {
    listActivities,
    createActivity,
    registerForActivity,
    cancelRegistration,
    listParticipants
};