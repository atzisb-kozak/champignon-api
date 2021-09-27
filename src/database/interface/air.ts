export interface CreateAir {
    etatVanneFroid: number;
    temperatureAir: number;
    temperatureAirNonEtalonner: number;
    consigneAir: number;
    consigneattendu: number;
    etalAir: number;
    pasAir: number;
}

export interface UpdateAir {
    etatVanneFroid?: number;
    temperatureAir?: number;
    temperatureAirNonEtalonner?: number;
    consigneAir?: number;
    consigneattendu?: number;
    etalAir?: number;
    pasAir?: number;
}