const router = require('express').Router();
const { newChannel, joinChannel, searchChannel, message, getChat, chats,addFile, findEmail } = require('../controller/channelController');
const validation = require("../middlewares/validation");
var jwtToken = require('../middlewares/jwtToken');
var multer = require('multer')
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public');
    },
    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
let upload = multer({ storage: storage}).single('attachment');


router.post('/newChannel',jwtToken, validation, newChannel);
router.post('/joinChannel',jwtToken, validation, joinChannel);
router.get('/search',jwtToken, validation, searchChannel);
router.post('/message',jwtToken, validation, upload, message);
router.post('/findEmail',jwtToken, validation, findEmail);
router.post('/getChat',jwtToken, validation, getChat);
router.post('/updatestatus',chats);
router.post('/addfile',jwtToken,addFile);

module.exports = router;