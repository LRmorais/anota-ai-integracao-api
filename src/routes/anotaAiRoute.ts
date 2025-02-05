import { Router, Request, Response } from 'express';

const router = Router();

router.get('/hello', (req: Request, res: Response) => {
    res.json({ message: 'Hello World from TypeScript!' });
});

export default router;
