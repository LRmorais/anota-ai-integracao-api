import { Router, Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responseHelper';
import AnotaAiConfig from '../database/models/AnotaAiConfig';

const router = Router();

router.post('/enable', async (req: Request, res: Response) => {
    const { company_id } = req.body;

    if (!company_id) {
        res.status(400).json(errorResponse('company_id é obrigatório'));
        return;
    }

    try {
        let config = await AnotaAiConfig.findOne({ where: { company_id } });

        if (!config) {
            config = await AnotaAiConfig.create({ company_id, active: true });
            res.status(201).json(successResponse('Configuração criada com sucesso'));
            return;
        }

        res.status(200).json(successResponse('Configuração criada com sucesso'));
    } catch (error) {
        if (error instanceof Error) {
            console.error(`[ERROR] Rota enable: ${error.message}`);
            res.status(500).json(errorResponse('Erro interno no servidor', error.message));
        } else {
            console.error('[ERROR] Rota enable: Erro desconhecido');
            res.status(500).json(errorResponse('Erro interno no servidor', 'Erro desconhecido'));
        }
    }
});

router.post('/disable', async (req: Request, res: Response) => {
    const { company_id } = req.body;

    if (!company_id) {
        res.status(400).json(errorResponse('company_id é obrigatório'));
        return;
    }

    try {
        const config = await AnotaAiConfig.findOne({ where: { company_id } });

        if (!config) {
            res.status(404).json(errorResponse('Configuração não encontrada'));
            return;
        }

        config.active = false;
        await config.save();

        res.status(200).json(successResponse('Configuração desabilitada com sucesso'));
    } catch (error) {
        if (error instanceof Error) {
            console.error(`[ERROR] Rota disable: ${error.message}`);
            res.status(500).json(errorResponse('Erro interno no servidor', error.message));
        } else {
            console.error('[ERROR] Rota disable: Erro desconhecido');
            res.status(500).json(errorResponse('Erro interno no servidor', 'Erro desconhecido'));
        }
    }
});


export default router;
