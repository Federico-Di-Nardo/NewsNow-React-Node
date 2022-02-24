import {Router} from 'express';
import { index } from '../controller/savedNews.controller'
const router = Router();
router.post('/savedNews', index);

export default router