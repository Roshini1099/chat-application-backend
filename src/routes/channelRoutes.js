const router = require('express').Router();
const { newChannel, joinChannel, searchChannel, message, getChat, chats,addFile, findEmail } = require('../controller/channelController');
const validation = require("../middlewares/validation");
var jwtToken = require('../middlewares/jwtToken');

router.post('/newChannel',jwtToken, validation, newChannel);
router.post('/joinChannel',jwtToken, validation, joinChannel);
router.get('/search',jwtToken, validation, searchChannel);
router.post('/message',jwtToken, validation, message);
router.post('/findEmail',jwtToken, validation, findEmail);
router.post('/getChat',jwtToken, validation, getChat);
router.post('/updatestatus',chats);
router.post('/addfile',jwtToken,addFile);

module.exports = router;