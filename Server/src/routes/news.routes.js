import {Router} from 'express';
import { index } from '../controller/news.controller'
const router = Router();
router.post('/news', index);

export default router