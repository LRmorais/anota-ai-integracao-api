import { Router, Request, Response } from 'express';
import Company from '../database/models/Company';

const router = Router();

router.get('/companies', async (req: Request, res: Response) => {
    try {
        const companies = await Company.findAll();
        res.json(companies);
    } catch (error) {
        console.error('Erro ao buscar empresas:', error);
        res.status(500).json({ message: 'Erro ao buscar empresas' });
    }
});

export default router;
