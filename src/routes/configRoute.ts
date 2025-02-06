import { Router, Request, Response } from 'express';
import axios from 'axios';
import { successResponse, errorResponse } from '../utils/responseHelper';
import AnotaAiConfig from '../database/models/AnotaAiConfig';
import {AnotaAuthResponse} from "../interfaces/AnotaAuthResponse";
import {AnotaLinkPageResponse} from "../interfaces/AnotaLinkPageResponse";

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

router.post('/create', async (req: Request, res: Response) => {
    const { store_id, integration_key, company_id, store_name } = req.body;

    if (!store_id || !integration_key || !company_id || !store_name) {
        res.status(400).json(errorResponse('ID da Loja, Chave de Integração, Nome da Loja são obrigatórios'));
        return;
    }

    try {
        const company = await AnotaAiConfig.findOne({ where: { company_id } });
        if (!company) {
            res.status(404).json(errorResponse('Empresa não encontrada'));
            return;
        }

        const tokenResponse = await axios.post<AnotaAuthResponse>(
            'https://oauth-public-order-api.anota.ai/authentication/v1.0/oauth/token',
            {
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-pooling-merchant': store_id,
                },
            }
        );

        const access_token = tokenResponse.data.access_token;

        const linkPageResponse = await axios.post<AnotaLinkPageResponse>(
            'https://public-api.anota.ai/developers-portal/v1.0/linkpage-by-token',
            {
                merchant_token: integration_key,
                external_id: '',
                external_token: '',
                order_accept: { url: '', method: 'POST' },
                order_cancel: { url: '', method: 'POST' },
                order_updated: { url: '', method: 'POST' },
            },
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );

        const result_token = linkPageResponse.data.token;

        await AnotaAiConfig.update(
            {
                store_id,
                integration_key,
                store_name,
                access_token: result_token,
            },
            { where: { company_id } }
        );

        res.status(200).json(successResponse('Configuração atualizada com sucesso', { store_id, integration_key, access_token: result_token }));
    } catch (error) {
        if (error instanceof Error) {
            console.error(`[ERROR] Rota create: ${error.message}`);
            res.status(500).json(errorResponse('Erro interno no servidor', error.message));
        } else {
            console.error('[ERROR] Rota create: Erro desconhecido');
            res.status(500).json(errorResponse('Erro interno no servidor', 'Erro desconhecido'));
        }
    }
});

export default router;
