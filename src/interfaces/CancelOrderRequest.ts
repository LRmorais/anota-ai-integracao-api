export interface CancelOrderRequest {
    id: string;
    canceled: boolean;
    merchant: {
        id: string;
    };
}
