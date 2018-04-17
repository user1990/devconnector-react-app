import express from 'express';
import { posts } from '../../controllers/posts';

const router = express.Router();

router.get('/test', posts);

export default router;
