import { Router } from 'express';
import configRoute from './configRoute';
import webhooksRoute from './webhooksRoute';
import integrationRoute from "./integrationRoute";

const router = Router();

router.use('/config', configRoute);

router.use('/webhooks', webhooksRoute);

router.use('/integration', integrationRoute);

export default router;
