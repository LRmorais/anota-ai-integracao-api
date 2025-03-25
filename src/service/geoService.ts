import axios from 'axios';
import { GoogleGeocodeResponse } from '../interfaces/GoogleGeocodeResponse';

interface Coordinates {
    latitude: string;
    longitude: string;
}

/**
 * Obtém latitude e longitude usando a API do Google Maps
 * @param address - Nome da rua
 * @param number - Número da residência
 * @param city - Cidade
 * @param state - Estado
 * @param postalCode - CEP (opcional)
 * @returns Retorna um objeto { latitude, longitude } ou `null` se não encontrar
 */
export const getCoordinatesFromAddress = async (
    address: string,
    number: string,
    city: string,
    state: string,
    postalCode?: string
): Promise<Coordinates | null> => {
    try {

        const formattedAddress = encodeURIComponent(`${address} ${number}, ${city}, ${state}, ${postalCode || ''}`);

        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

        const response = await axios.get<GoogleGeocodeResponse>(url);

        if (response.data.status === 'OK' && response.data.results.length > 0) {
            const location = response.data.results[0].geometry.location;

            return {
                latitude: location.lat.toString(),
                longitude: location.lng.toString(),
            };
        } else {
            console.warn(`[GEO] Nenhuma coordenada encontrada para: ${formattedAddress}`);
            return null;
        }
    } catch (error) {
        console.error(`[GEO] Erro ao obter coordenadas:`, error);
        return null;
    }
};
