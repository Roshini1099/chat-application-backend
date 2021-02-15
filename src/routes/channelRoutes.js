const router = require('express').Router();
const { newChannel, joinChannel, searchChannel, message } = require('../controller/channelController');
const validation = require("../middlewares/validation");
var jwtToken = require('../middlewares/jwtToken');

router.post('/newChannel', jwtToken, validation, newChannel);
router.post('/joinChannel', jwtToken, validation, joinChannel);
router.get('/search', jwtToken, validation, searchChannel);
router.post('/message', jwtToken, validation, message);

module.exports = router;
