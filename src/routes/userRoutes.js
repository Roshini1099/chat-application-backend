const router = require('express').Router();
const { details, edit } = require('../controller/userController');
const validation = require("../middlewares/validation");
var jwtToken = require('../middlewares/jwtToken');

router.get('/details', validation, details);
router.post('/edit',  validation, edit);
module.exports = router;
