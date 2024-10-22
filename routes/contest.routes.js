const express = require('express');
const router = express.Router();
const contestController = require('../controllers/contest.controller');
const { requireAuth } = require("../middleware/auth.middleware");


// Routes pour les contests
router.post('/create', requireAuth, contestController.createContest);
router.get('/:id', contestController.getContestById);
router.get('/', contestController.getAllContests);
router.patch('/:id', contestController.updateContest);
router.delete('/:id', contestController.deleteContest);

// Route pour terminer un contest
router.post('/endContest/:contestId', contestController.endContest);

module.exports = router;
