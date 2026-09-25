import express from 'express';
import { handleChat, handleExplainCode, handleHint } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/chat', protect, handleChat);
router.post('/explain-code', protect, handleExplainCode);
router.post('/hint', protect, handleHint);

export default router;
