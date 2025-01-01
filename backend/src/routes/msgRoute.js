import {Router} from 'express';
import { restrictTo } from '../middlewares/authentication.js';
import {getAllMessages,getUsersForSidebar,sendMessage} from '../controller/msgController.js';

const router = Router();

router.get('/users',restrictTo(),getUsersForSidebar);

router.get('/:id',restrictTo(),getAllMessages);

router.post('/send/:id',restrictTo(),sendMessage);

export default router;