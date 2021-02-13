const router = require('express').Router();
const { login, register } = require('../controller/authController');
const validation = require("../middlewares/validation");

router.post('/login', validation, login);
router.post('/register', validation, register);

module.exports = router;
