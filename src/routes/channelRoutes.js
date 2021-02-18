const router = require('express').Router();
const { newChannel, joinChannel, searchChannel, message, getChat, getCurrentChat, chats } = require('../controller/channelController');
const validation = require("../middlewares/validation");
var jwtToken = require('../middlewares/jwtToken');

router.post('/newChannel', validation, newChannel);
router.post('/joinChannel', validation, joinChannel);
router.get('/search', validation, searchChannel);
router.post('/message', validation, message);
router.post('/getChat', validation, getChat);
router.post('/getCurrentChat', validation, getCurrentChat);
router.post('/chats',chats);

module.exports = router;