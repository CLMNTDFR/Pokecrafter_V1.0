const express = require('express');
const router = express.Router();
const artworkContestController = require('../controllers/artwork.contest.controller');

// Basic CRUD operation
router.post('/', artworkContestController.createArtworkContest);
router.get('/:id', artworkContestController.getArtworkContestById);
router.get('/contest/:contestID', artworkContestController.getArtworksByContestId);
router.patch('/:id', artworkContestController.updateArtworkContest);
router.delete('/:id', artworkContestController.deleteArtworkContest);


router.patch('/like-artwork-contest/:id', artworkContestController.likeArtworkContest);
router.patch('/unlike-artwork-contest/:id', artworkContestController.unlikeArtworkContest);
router.patch('/comment-artwork-contest/:id', artworkContestController.commentArtworkContest);
router.patch('/edit-comment-artwork-contest/:id', artworkContestController.editCommentArtworkContest);
router.patch('/delete-comment-artwork-contest/:id', artworkContestController.deleteCommentArtworkContest);

module.exports = router;
