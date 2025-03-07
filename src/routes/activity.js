const express = require('express');
const { authMiddleware, isAdmin } = require('../middleware/auth');
const {
    listActivities,
    createActivity,
    registerForActivity,
    cancelRegistration,
    listParticipants
} = require('../controllers/activityController');

const router = express.Router();

// Rotas públicas
router.get('/', listActivities);

// Rotas protegidas
router.post('/', authMiddleware, isAdmin, createActivity);
router.post('/:id/register', authMiddleware, registerForActivity);
router.post('/:id/cancel', authMiddleware, cancelRegistration);
router.get('/:id/participants', authMiddleware, isAdmin, listParticipants);

module.exports = router;