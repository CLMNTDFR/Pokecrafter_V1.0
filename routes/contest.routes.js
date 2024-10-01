const express = require('express');
const router = express.Router();
const contestController = require('../controllers/contest.controller');
const fileUpload = require('express-fileupload'); // Require express-fileupload
const path = require('path');

// Routes pour les contests
router.post('/create', contestController.createContest);
router.get('/:id', contestController.getContestById);
router.get('/', contestController.getAllContests);
router.put('/:id', contestController.updateContest);
router.delete('/:id', contestController.deleteContest);

module.exports = router;
