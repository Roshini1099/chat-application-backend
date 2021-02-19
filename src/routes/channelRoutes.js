const router = require('express').Router();
const { newChannel, joinChannel, searchChannel, message, getChat, chats,addFile } = require('../controller/channelController');
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


router.post('/newChannel', validation, newChannel);
router.post('/joinChannel', validation, joinChannel);
router.get('/search', validation, searchChannel);
router.post('/message', validation,upload, message);
router.post('/getChat', validation, getChat);
router.post('/updatestatus',chats);
router.post('/addfile',addFile);

module.exports = router;