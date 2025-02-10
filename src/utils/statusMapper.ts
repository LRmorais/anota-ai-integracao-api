import { OrderStatus } from '../interfaces/OrderRequest';

/**
 * Mapeia os valores de OrderStatusResponse.check para OrderStatus.
 * @param check - O valor do status recebido no payload.
 * @returns O status correspondente em OrderStatus.
 */
export const mapOrderStatus = (check: number): OrderStatus => {
    switch (check) {
        case 0:
            return OrderStatus.WAITING; // Em análise → Aguardando
        case 1:
            return OrderStatus.PREPARING; // Em produção → Preparando
        case 2:
            return OrderStatus.ON_THE_WAY_PICKUP; // Pronto → A caminho para retirada
        case 3:
            return OrderStatus.ON_THE_WAY; // Finalizado → A caminho
        case 4:
            return OrderStatus.CANCELED; // Cancelado
        case 5:
            return OrderStatus.CANCELED; // Negado → Cancelado
        case 6:
            return OrderStatus.ON_THE_WAY_TO_WITHDRAWAL; // Solicitação de cancelamento
        default:
            return OrderStatus.WAITING; // Padrão
    }
};
