import {Router} from 'express';
import { index, isLogged } from '../controller/user.controller.js'
const router = Router();
router.post('/user', index);
router.get('/user', isLogged);

export default router