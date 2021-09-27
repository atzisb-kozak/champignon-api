export interface CreateCo2 {
    dureeVariateurOff: number;
    consigneCo2: number;
    co2: number;
    freq: number;
    consigneattendu: number;
    pasCo2: number;
}

export interface UpdateCo2 {
    dureeVariateurOff?: number;
    consigneCo2?: number;
    co2?: number;
    freq?: number;
    consigneattendu?: number;
    pasCo2?: number;
}