import { Router, Request, Response } from 'express';
import { OrderStatusResponse } from '../interfaces/webhooks/OrderStatusResponse';
import AnotaAiConfig from '../database/models/AnotaAiConfig';

const router = Router();

router.post('/order_status', async (req: Request, res: Response) => {
    const payload: OrderStatusResponse = req.body;

    if (!payload.merchant || !payload.merchant.id) {
        res.status(400).json({ message: 'Campo merchant.id é obrigatório' });
        return
    }

    try {
        const config = await AnotaAiConfig.findOne({ where: { store_id: payload.merchant.id } });

        if (!config) {
            res.status(404).json({ message: 'Configuração não encontrada para o merchant.id fornecido' });
            return
        }

        console.log('Configuração encontrada:', config);

        res.status(200).json({ message: 'Webhook processado com sucesso', config });
        return;
    } catch (error) {
        console.error('Erro ao processar o webhook:', error);
        res.status(500).json({ message: 'Erro interno ao processar o webhook' });
    }
});

export default router;
