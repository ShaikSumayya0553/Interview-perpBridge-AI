import express from 'express';
import {
  getDsaProblems,
  getDsaStats,
  createDsaProblem,
  updateDsaProblem,
  deleteDsaProblem
} from '../controllers/dsaController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getDsaStats);

router.route('/')
  .get(getDsaProblems)
  .post(createDsaProblem);

router.route('/:id')
  .put(updateDsaProblem)
  .delete(deleteDsaProblem);

export default router;
