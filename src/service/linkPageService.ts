import axios from 'axios';
import { AnotaLinkPageResponse } from '../interfaces/AnotaLinkPageResponse';

/**
 * Função para obter o linkPageResponse
 * @param accessToken - Token de acesso obtido na autenticação
 * @param integrationKey - Chave de integração do merchant
 * @returns Retorna o token da link page ou `null` em caso de erro
 */
export const getLinkPageToken = async (accessToken: string, integrationKey: string): Promise<string | null> => {
    try {
        const url_lambda = process.env.URL_LAMBDA_ANOTA_AI;

        const response = await axios.post<AnotaLinkPageResponse>(
            'https://public-api.anota.ai/developers-portal/v1.0/linkpage-by-token',
            {
                merchant_token: integrationKey,
                external_id: '',
                external_token: '',
                order_accept: { url: `${url_lambda}/anotaai/webhooks/order_status`, method: 'POST' },
                order_cancel: { url: `${url_lambda}/anotaai/webhooks/cancel_order`, method: 'POST' },
                order_updated: { url: `${url_lambda}/anotaai/webhooks/order_status`, method: 'POST' },
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response.data.token || null;
    } catch (error) {
        console.error(`[ERROR] linkPageService: Falha ao obter linkPageToken`, error);
        return null;
    }
};
