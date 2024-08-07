const express = require('express');
const router = express.Router();
const PageController = require('../controllers/PageController');
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');
const AdminController = require('../controllers/AdminController');
const ExaminerController = require('../controllers/ExaminerController');
const authMiddleware = require('../middleware/authMiddleware');

// Page Routes
router.get('/', PageController.homePage);
router.get('/g', authMiddleware(['driver']), PageController.gPage);
router.get('/g2', authMiddleware(['driver']), PageController.g2Page);
router.get('/logout', authMiddleware(), PageController.logout);
router.get('/login', PageController.login);

// Authentication Routes
router.post('/signUpUser', AuthController.signUpUser);
router.post('/loginUser', AuthController.loginUser);

// User Routes
router.post('/updateUserDetails', authMiddleware(['driver']), UserController.updateUserDetails);
router.post('/updateCarDetails', authMiddleware(['driver']), UserController.updateCarDetails);
router.post('/bookAppointment', authMiddleware(['driver']), UserController.bookAppointment);

// Admin Routes
router.get('/appointment', authMiddleware(['admin']), AdminController.appointment);
router.post('/addAppointment', authMiddleware(['admin']), AdminController.addAppointment);

// Examiner Routes
router.get('/examiner', authMiddleware(['examiner']), ExaminerController.examiner);
router.post('/updateTestResult', authMiddleware(['examiner']), ExaminerController.updateTestResult);

module.exports = router;
