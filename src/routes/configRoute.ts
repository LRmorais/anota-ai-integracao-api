import { Router, Request, Response } from 'express';
import { getAuthToken } from '../service/authAnotaAiService';
import { successResponse, errorResponse } from '../utils/responseHelper';
import AnotaAiConfig from '../database/models/AnotaAiConfig';
import {getLinkPageToken} from "../service/linkPageService";

const router = Router();

router.post('/enable', async (req: Request, res: Response) => {
    const { company_id, slot_id } = req.body;

    if (!company_id && !slot_id) {
        res.status(400).json(errorResponse('company_id e slot_id são obrigatórios'));
        return;
    }

    try {
        let config = await AnotaAiConfig.findOne({
            where: { company_id, slot_id },
        });

        if (!config) {
            config = await AnotaAiConfig.create({ company_id, active: true, slot_id });
            res.status(201).json(successResponse('Configuração criada com sucesso'));
            return;
        }

        await AnotaAiConfig.update({ active: true }, { where: { company_id, slot_id } });

        res.status(200).json(successResponse('Configuração Anota Ai habilitada com sucesso'));
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
    const { company_id, slot_id } = req.body;

    if (!company_id && !slot_id) {
        res.status(400).json(errorResponse('company_id e slot_id são obrigatórios'));
        return;
    }

    try {
        const config = await AnotaAiConfig.findOne({ where: { company_id, slot_id } });

        if (!config) {
            res.status(404).json(errorResponse('Configuração não encontrada'));
            return;
        }

        config.active = false;
        await config.save();

        res.status(200).json(successResponse('Configuração Anota Ai desabilitada com sucesso'));
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
    const { store_id, integration_key, company_id, store_name, slot_id } = req.body;

    if (!store_id || !integration_key || !company_id || !store_name) {
        res.status(400).json(errorResponse('ID da Loja, Chave de Integração, Nome da Loja são obrigatórios'));
        return;
    }

    try {
        const company = await AnotaAiConfig.findOne({ where: { company_id, slot_id } });

        if (!company) {
            res.status(404).json(errorResponse('Empresa não encontrada'));
            return;
        }

        const access_token = await getAuthToken(store_id);

        if (!access_token) {
            res.status(500).json(errorResponse('Falha ao realizar autenticação no anota ai, verifique as credenciais e tente novamente'));
            return;
        }

        const result_token = await getLinkPageToken(access_token, integration_key);

        if (!result_token) {
            res.status(500).json(errorResponse('Falha ao concluir integração, verifique as credenciais e tente novamente'));
            return;
        }

        await AnotaAiConfig.update(
            {
                store_id,
                integration_key,
                store_name,
                access_token: result_token,
            },
            { where: { company_id } }
        );

        res.status(200).json(successResponse('Configuração atualizada com sucesso', { store_id, integration_key, store_name }));
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
