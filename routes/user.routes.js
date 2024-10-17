const router = require('express').Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const uploadController = require('../controllers/upload.controller');
const authMiddleware = require('../middleware/auth.middleware'); // Assurez-vous que le chemin est correct
const fileUpload = require('express-fileupload');
const path = require('path');


router.post("/register", authController.signUp);
router.post('/login', authController.signIn);
router.get('/logout', authController.logout);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.userInfo);
router.patch("/:id", userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.patch('/follow/:id', userController.follow);
router.patch('/unfollow/:id', userController.unfollow);

router.post("/upload", uploadController.uploadProfil);


module.exports = router;

module.exports = router;
