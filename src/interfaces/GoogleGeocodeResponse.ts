export interface GoogleGeocodeResponse {
    results: GoogleGeocodeResult[];
    status: string;
}

export interface GoogleGeocodeResult {
    address_components: AddressComponent[];
    formatted_address: string;
    geometry: Geometry;
    place_id: string;
    plus_code?: PlusCode;
    types: string[];
}

export interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}

export interface Geometry {
    location: LatLng;
    location_type: string;
    viewport: Viewport;
}

export interface LatLng {
    lat: number;
    lng: number;
}

export interface Viewport {
    northeast: LatLng;
    southwest: LatLng;
}

export interface PlusCode {
    compound_code: string;
    global_code: string;
}
