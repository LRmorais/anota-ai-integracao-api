import { Router, Request, Response } from 'express';
import axios from 'axios';
import AnotaAiConfig from '../database/models/AnotaAiConfig';
import { errorResponse, successResponse } from '../utils/responseHelper';

const router = Router();

router.get('/listar_pedidos/:company_id', async (req: Request, res: Response) => {
    const { company_id } = req.params;

    try {
        const config = await AnotaAiConfig.findOne({ where: { company_id } });

        if (!config) {
            res.status(404).json(errorResponse('Configuração não encontrada para o company_id fornecido'));
            return
        }

        const { access_token } = config;

        if (!access_token) {
            res.status(400).json(errorResponse('Access token não encontrado na configuração'));
            return
        }

        const response = await axios.get(`${process.env.ANOTA_AI_URL}/ping/list`, {
            headers: {
                Authorization: `${access_token}`,
            },
        });

        res.status(200).json(successResponse('Pedidos listados com sucesso', response.data));
    } catch (error) {
        console.error('Erro ao listar pedidos:', error);
        res.status(500).json(errorResponse('Erro interno ao listar pedidos', error.message));
    }
});

router.get('/detalhe_pedido/:company_id/:anota_ai_order_id', async (req: Request, res: Response) => {
    const { anota_ai_order_id, company_id } = req.params;

    try {
        const config = await AnotaAiConfig.findOne({ where: { company_id } });

        if (!config) {
            res.status(404).json(errorResponse('Configuração não encontrada para o anota_ai_order_id fornecido'));
            return
        }

        const { access_token } = config;

        if (!access_token) {
            res.status(400).json(errorResponse('Access token não encontrado na configuração'));
            return
        }

        const response = await axios.get(`${process.env.ANOTA_AI_URL}/ping/get/${anota_ai_order_id}`, {
            headers: {
                Authorization: access_token,
            },
        });

        res.status(200).json(successResponse('Detalhes do pedido obtidos com sucesso', response.data));
    } catch (error) {
        console.error('Erro ao obter detalhes do pedido:', error);
        res.status(500).json(errorResponse('Erro interno ao obter detalhes do pedido', error.message));
    }
});

export default router;
