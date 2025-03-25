import axios from 'axios';
import { AnotaAuthResponse } from '../interfaces/AnotaAuthResponse';

/**
 * Obtém o token de autenticação da AnotaAi
 * @param store_id - Identificador da loja
 * @returns Retorna o token de acesso ou `null` em caso de erro
 */
export const getAuthToken = async (store_id: string) => {
    try {
        const response = await axios.post<AnotaAuthResponse>(
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

        return response.data.access_token || null;
    } catch (error) {
        console.error(`[ERROR] authAnotaAiService: Falha ao obter token de autenticação`, error);
        return null;
    }
};
