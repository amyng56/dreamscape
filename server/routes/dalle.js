import express from 'express';
import * as dotenv from 'dotenv';

import requireAuth from '../middleware/auth.js';
import { generateImage, interpretDream } from '../controllers/dalle.js';

dotenv.config();

const router = express.Router();

router.use(requireAuth);

router.post('/', generateImage);
router.post('/interpret-dream', interpretDream);

export default router;