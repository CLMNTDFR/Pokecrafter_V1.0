const express = require('express');
const router = express.Router();
const artworkContestController = require('../controllers/artwork.contest.controller');
const fileUpload = require('express-fileupload'); // Require express-fileupload
const path = require('path');

// Routes pour les ArtworkContest
router.post('/', artworkContestController.createArtworkContest);
router.get('/:id', artworkContestController.getArtworkContestById);
// Route pour obtenir tous les artworks d'un contest par l'ID du contest
router.get('/contest/:contestID', artworkContestController.getArtworksByContestId);
router.patch('/:id', artworkContestController.updateArtworkContest);
router.delete('/:id', artworkContestController.deleteArtworkContest);

// like and dislike

router.patch('/like-artwork-contest/:id', artworkContestController.likeArtworkContest);
router.patch('/unlike-artwork-contest/:id', artworkContestController.unlikeArtworkContest);

// Comments
router.patch('/comment-artwork-contest/:id', artworkContestController.commentArtworkContest);
router.patch('/edit-comment-artwork-contest/:id', artworkContestController.editCommentArtworkContest);
router.patch('/delete-comment-artwork-contest/:id', artworkContestController.deleteCommentArtworkContest);



module.exports = router;
