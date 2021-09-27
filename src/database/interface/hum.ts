export interface CreateHum {
    temperatureSec: number;
    temperatureHum: number;
    tauxHumidite: number;
    consigneHum: number;
    consigneattendu: number;
    etalSec: number;
    etalHum: number;
    pasHum: number;
}

export interface UpdateHum {
    temperatureSec?: number;
    temperatureHum?: number;
    tauxHumidite?: number;
    consigneHum?: number;
    consigneattendu?: number;
    etalSec?: number;
    etalHum?: number;
    pasHum?: number;
}