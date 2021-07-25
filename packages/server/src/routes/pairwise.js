import express from 'express';
import PairwiseController from '../controllers/pairwise';

const router = express.Router();

router.post('/', PairwiseController.getPairwise);

export default router;
