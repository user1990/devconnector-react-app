import express from 'express';
import { profile } from '../../controllers/profile';

const router = express.Router();

router.get('/test', profile);

export default router;
