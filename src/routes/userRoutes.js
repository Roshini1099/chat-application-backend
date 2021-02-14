const router = require('express').Router();
const { details, edit } = require('../controller/userController');
const validation = require("../middlewares/validation");
var jwtToken = require('../middlewares/jwtToken');

router.get('/details', jwtToken, validation, details);
router.post('/edit', jwtToken, validation, edit);
module.exports = router;
