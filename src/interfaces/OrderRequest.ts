export interface OrderRequest {
    company_id: string;
    orders: Order[];
}

export interface Order {
    customer: Customer;
    amount: string; // Valor total do pedido
    change: string; // Troco para pagamento
    observation: string; // Observação do pedido
    return: boolean; // Indica se o pedido é de retorno
    packet_type_id: string; // Tipo do pacote
    payment_type_id: string; // Tipo de pagamento
    order_status_id: number; // Status inicial do pedido
    thermal_box: boolean; // Requer caixa térmica
    get_sign: boolean; // Requer assinatura
}

export interface Customer {
    name: string; // Nome do cliente
    phones: string; // Telefone do cliente
    address: Address; // Endereço do cliente
}

export interface Address {
    address: string; // Nome da rua
    number: string; // Número da residência
    complement: string; // Complemento do endereço
    neighborhood: string; // Bairro
    city: string; // Cidade
    uf: string; // Estado
    postal_code: string; // CEP
    latitude: string; // Latitude
    longitude: string; // Longitude
}
