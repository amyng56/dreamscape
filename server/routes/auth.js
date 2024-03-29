import express from 'express';

import { signUpUser, signInUser } from '../controllers/users.js';

const router = express.Router();

router.post("/signup", signUpUser);
router.post("/signin", signInUser);

export default router;
