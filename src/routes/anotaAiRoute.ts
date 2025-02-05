import { Router } from 'express';
import configRoute from './configRoute';

const router = Router();

router.use('/config', configRoute);

export default router;
