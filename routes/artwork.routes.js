const router = require('express').Router();
const artworkController = require('../controllers/artwork.controller');

router.get('/', artworkController.readArtwork);
router.get('/:id', artworkController.readArtworkById);
router.post('/', artworkController.createArtwork);
router.put('/:id', artworkController.updateArtwork);
router.delete('/:id', artworkController.deleteArtwork);

router.patch('/like-artwork/:id', artworkController.likeArtwork);
router.patch('/unlike-artwork/:id', artworkController.unlikeArtwork);
router.patch('/comment-artwork/:id', artworkController.commentArtwork);
router.patch('/edit-comment-artwork/:id', artworkController.editCommentArtwork);
router.patch('/delete-comment-artwork/:id', artworkController.deleteCommentArtwork);


module.exports = router;