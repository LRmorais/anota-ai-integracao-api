export enum OrderStatus {
    ANALYSIS = 0, // Em análise
    IN_PRODUCTION = 1, // Em produção
    READY = 2, // Pronto
    FINISHED = 3, // Finalizado
    CANCELED = 4, // Cancelado
    DENIED = 5, // Negado
    CANCELLATION_REQUEST = 6, // Solicitação de cancelamento de pedido
}

export interface OrderStatusResponse {
    menu_version: number;
    _id: string;
    id: string;
    check: OrderStatus;
    shortReference: number;
    createdAt: string;
    type: string;
    time_max: string;
    merchant: {
        restaurantId: string;
        name: string;
        id: string;
        unit: string;
    };
    payments: Payment[];
    customer: Customer;
    items: Item[];
    total: number;
    deliveryFee: number;
    pdv: {
        status: boolean;
        mode: number;
    };
    additionalFees: any[];
    salesChannel: string;
    deliveryAddress: DeliveryAddress;
    discounts: Discount[];
}

export interface Payment {
    name: string;
    code: string;
    value: number;
    cardSelected: string;
    externalId: string;
    changeFor: number | null;
    prepaid: boolean;
}

export interface Customer {
    id: string;
    name: string;
    phone: string;
    taxPayerIdentificationNumber: string;
}

export interface Item {
    id: number;
    name: string;
    quantity: number;
    internalId: string;
    price: number;
    total: number;
    subItems: SubItem[];
}

export interface SubItem {
    name: string;
    quantity: number;
    internalId: string;
    price: number;
    total: number;
    externalCode: string;
    id: number;
    id_parent: number;
}

export interface DeliveryAddress {
    formattedAddress: string;
    country: string;
    state: string;
    city: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    neighborhood: string;
    streetName: string;
    streetNumber: string;
    postalCode: string;
    complement: string;
}

export interface Discount {
    amount: number;
    tag: string;
}
