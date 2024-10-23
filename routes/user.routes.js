const router = require('express').Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const uploadController = require('../controllers/upload.controller');

// Auth routes
router.post("/register", authController.signUp);
router.post('/login', authController.signIn);
router.get('/logout', authController.logout);

// Basic CRUD opération
router.get('/', userController.getAllUsers);
router.get('/:id', userController.userInfo);
router.patch("/:id", userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.patch('/follow/:id', userController.follow);
router.patch('/unfollow/:id', userController.unfollow);

// Route to change profile picture
router.post("/upload", uploadController.uploadProfil);


module.exports = router;
