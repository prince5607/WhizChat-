const {Router} = require('express');
const { restrictTo } = require('../middlewares/authentication');
const {getAllMessages,getUsersForSidebar,sendMessage} = require('../controller/msgController');

const router = Router();

router.get('/users',restrictTo(),getUsersForSidebar);

router.get('/:id',restrictTo(),getAllMessages);

router.post('/send/:id',restrictTo(),sendMessage);

module.exports = router;