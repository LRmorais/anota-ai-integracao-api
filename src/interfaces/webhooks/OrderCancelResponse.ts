export interface OrderCancelResponse {
    id: string;
    justification: string;
    canceled: boolean;
    merchant: {
        id: string;
    };
}
