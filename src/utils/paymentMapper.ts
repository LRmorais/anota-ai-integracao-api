import { PaymentType } from '../interfaces/OrderRequest';

/**
 * Mapeia os valores de `name` ou `code` para o enum `PaymentType`.
 * @param paymentCode - O valor do `name` ou `code` recebido no payment.
 * @returns O tipo correspondente no enum `PaymentType`.
 */
export const mapPaymentType = (paymentCode: string): PaymentType => {
    switch (paymentCode.toLowerCase()) {
        case 'money':
            return PaymentType.DINHEIRO;
        case 'card':
            return PaymentType.CARTAO_CREDITO;
        case 'debit':
            return PaymentType.CARTAO_DEBITO;
        case 'online':
            return PaymentType.ONLINE;
        case 'online_credit':
            return PaymentType.ONLINE;
        case 'pix':
            return PaymentType.ONLINE;
        default:
            return PaymentType.ONLINE;
    }
};
