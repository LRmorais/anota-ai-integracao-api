import { Router, Request, Response } from 'express';
import axios from 'axios';
import { OrderStatusResponse } from '../interfaces/webhooks/OrderStatusResponse';
import {OrderRequest, OrderStatus, PacketType, PaymentType} from '../interfaces/OrderRequest';
import AnotaAiConfig from '../database/models/AnotaAiConfig';
import { errorResponse, successResponse } from '../utils/responseHelper';
import {mapOrderStatus} from "../utils/statusMapper";
import {mapPaymentType} from "../utils/paymentMapper";
import {OrdersResponse} from "../interfaces/OrdersResponse";
import AnotaAiOrders from "../database/models/AnotaAiOrders";
import {CancelOrderRequest} from "../interfaces/CancelOrderRequest";
import {getCoordinatesFromAddress} from "../service/geoService";
import {UptadeOrder} from "../interfaces/UptadeOrder";

const router = Router();

router.post('/order_status', async (req: Request, res: Response) => {
    const payload: OrderStatusResponse = req.body;
    console.log('Payload Anota AI:', payload);
    if (!payload.merchant || !payload.merchant.id) {
        res.status(400).json(errorResponse('Campo merchant.id é obrigatório'));
        return
    }

    try {
        const config = await AnotaAiConfig.findOne({ where: { store_id: payload.merchant.id } });

        if (!config) {
            res.status(404).json(errorResponse('Configuração não encontrada para o merchant.id fornecido'));
            return
        }

        if(!config.active){
            res.status(400).json(errorResponse('Configuração desativada'));
            return
        }

        const { company_id } = config;

        if (!company_id ) {
            res.status(400).json(errorResponse('Company ID ou access token não encontrado na configuração'));
            return
        }

        const mappedStatus = mapOrderStatus(payload.check);

        const order = await AnotaAiOrders.findOne({
            where: { anota_ai_order_id: payload.id, store_id: payload.merchant.id },
        });

        if(!order) {
            let paymentType: PaymentType = PaymentType.ONLINE;
            let change = '0';

            if (payload.payments.length > 0) {
                paymentType = mapPaymentType(payload.payments[0].code || payload.payments[0].name);

                const paymentWithChange = payload.payments.find(payment => payment.changeFor !== null);
                if (paymentWithChange) {
                    change = paymentWithChange.changeFor?.toString() || '0';
                }
            }

            let latitude = payload.deliveryAddress?.coordinates?.latitude?.toString() || '0.0';
            let longitude = payload.deliveryAddress?.coordinates?.longitude?.toString() || '0.0';

            if (!latitude || !longitude || latitude === '0.0' || longitude === '0.0') {
                console.log('[GEO] Coordenadas ausentes, buscando com base no endereço...');

                const geoData = await getCoordinatesFromAddress(
                    payload.deliveryAddress?.streetName || '',
                    payload.deliveryAddress.streetNumber || '',
                    payload.deliveryAddress?.city || '',
                    payload.deliveryAddress?.state || '',
                    payload.deliveryAddress?.postalCode || ''
                );

                if (geoData) {
                    latitude = geoData.latitude;
                    longitude = geoData.longitude;
                }
            }

            const orderRequestPayload: OrderRequest = {
                company_id: company_id.toString(),
                orders: [
                    {
                        customer: {
                            name: payload.customer?.name || '',
                            phones: payload.customer?.phone || '',
                            address: {
                                address: payload.deliveryAddress?.streetName || '',
                                number: payload.deliveryAddress?.streetNumber || '',
                                complement: payload.deliveryAddress?.complement || '',
                                neighborhood: payload.deliveryAddress?.neighborhood || '',
                                city: payload.deliveryAddress?.city || '',
                                uf: payload.deliveryAddress?.state || '',
                                postal_code: payload.deliveryAddress?.postalCode || '',
                                latitude,
                                longitude,
                            },
                        },
                        amount: payload.total?.toString() || '0.00',
                        change: change,
                        observation: '',
                        return: false,
                        packet_type_id: PacketType.NORMAL,
                        payment_type_id: paymentType,
                        order_status_id: mappedStatus,
                        thermal_box: true,
                        get_sign: false,
                        anota_ai_order: {
                            store_id: payload.merchant.id,
                            company_id,
                            anota_ai_order_id: payload.id,
                            check_status: payload.check,
                        }
                    },
                ],
            };

            const response = await axios.post<OrdersResponse>(`${process.env.LOOCAL_API_URL}/orders`, orderRequestPayload, {
                headers: {
                    Authorization: `Bearer ${process.env.TOKEN_LOOCAL}`,
                    'Content-Type': 'application/json',
                },
            });
            res.status(200).json(successResponse('Pedido enviado e registrado com sucesso', { response: response.data }));
            return
        }

        const response = await axios.put<UptadeOrder>(
            `${process.env.LOOCAL_API_URL}/orders/${order?.order_id}/status`,
            {
                order_status_id: mappedStatus,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.TOKEN_LOOCAL}`,
                    'Content-Type': 'application/json',
                },
            }
        )

        res.status(200).json(successResponse('Status do pedido atualizado com sucesso.', { response: response.data }));

    } catch (error) {
        console.error('Erro ao processar o webhook e enviar o pedido:', error);
        res.status(500).json(errorResponse('Erro interno ao processar o webhook', error.message));
    }
});

router.post('/cancel_order', async (req: Request, res: Response) => {
    const payload: CancelOrderRequest = req.body;
    console.log('Payload Anota AI:', payload);
    if (!payload.id || !payload.merchant?.id) {
        res.status(400).json(errorResponse('Os campos id e merchant.id são obrigatórios.'));
        return
    }

    const config = await AnotaAiConfig.findOne({ where: { store_id: payload.merchant.id } });

    if(!config?.active){
        res.status(400).json(errorResponse('Configuração desativada'));
        return
    }

    try {
        const order = await AnotaAiOrders.findOne({
            where: { anota_ai_order_id: payload.id, store_id: payload.merchant.id },
        });

        if (!order) {
            res.status(404).json(errorResponse('Ordem não encontrada.'));
            return
        }

        order.check_status = 4; // 4 → Cancelado
        await order.save();

        const response = await axios.put(
            `${process.env.LOOCAL_API_URL}/orders/${order.order_id}/status`,
            {
                order_status_id: 4, // 4 → Cancelado
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.TOKEN_LOOCAL}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.status(200).json(successResponse('Ordem cancelada com sucesso.', response.data));
    } catch (error) {
        console.error('Erro ao cancelar ordem:', error);
        res.status(500).json(errorResponse('Erro interno ao cancelar ordem.', error.message));
    }
});

export default router;
