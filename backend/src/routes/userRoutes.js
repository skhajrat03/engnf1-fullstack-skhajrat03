
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

import {
  registerUser,
  loginUser,
} from '../controllers/userController.js';

const router = express.Router();


router.post('/register', registerUser);


router.post('/login', loginUser);


router.get('/profile', authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'You are authenticated!',
    user: req.user,
  });
});

export default router;
