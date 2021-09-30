import { getStateRelay, switchRelay, gpioCan, writePin } from '@raspberry/raspberry';
import { sensorTemperature } from '@constant/pin'
import Socket from 'socket';
import { delay } from './delay';
import { createHum } from '@database/bdd';
import { logger } from 'logger';

interface dataHum {
	temperatureSec:number;
	temperatureHum:number;
	temperatureSecNonEtalonner:number;
	temperatureHumNonEtalonner:number;
	tauxHumidite:number;
	consigneHum:number;
	consigneattendu:number;
	etalSec:number;
	etalHum:number;
	pasHum: number;
}

let dataHum: dataHum = {
	temperatureSec: 0,
	temperatureHum: 0,
	temperatureSecNonEtalonner: 0,
	temperatureHumNonEtalonner: 0,
	tauxHumidite: 0,
	consigneHum: 16,
	consigneattendu: 20,
	etalSec: 0,
	etalHum: 0,
	pasHum: 0
};


let gpioSec: number = sensorTemperature.gpioSec;
let gpioHum: number = sensorTemperature.gpioHum;
let gpioBrume: number = sensorTemperature.gpioEauxSols;
let deltaTemp=0;
let dureeAction=0;
let procedure: string;
let deltaHum=0;

export async function gestionHum(mesureSec: number, mesureHum: number){
	try {;
		logger.info('Mesure Seche :');
		dataHum.temperatureSec = mesureSec;
		// Socket.emit('',dataHum.temperatureSec);
		dataHum.temperatureHum = mesureHum;
		logger.info(`Mesure Humide : ${dataHum.temperatureHum}`);
		//Socket.emit('',dataHum.temperatureHum);
		let pressSaturanteSec = calculPression(dataHum.temperatureSec);
		let pressSaturanteHum = calculPression(dataHum.temperatureHum);

		let pw = pressSaturanteHum - 1013 * 0.000662 * (dataHum.temperatureSec - dataHum.temperatureHum);
		dataHum.tauxHumidite = pw/pressSaturanteSec * 100;
		logger.info('Taux Humidite', dataHum.tauxHumidite);

		await createHum(dataHum);
		return (dataHum.tauxHumidite);

	}catch(error){
		logger.error('erreur mesure humidite');
	}
}

function calculPression(temp: number){
	let pression: number;

	let tabPressionSaturante = [
		12.28,12.364,12.448,12.532,12.616,12.7,12.784,12.868,12.952,13.036,13.12,13.21,13.3,13.39,13.48,
		13.57,13.66,13.75,13.84,13.93,14.02,14.115,14.21,14.305,14.4,14.495,14.59,14.685,14.78,14.875,
		14.97,15.071,15.172,15.273,15.374,15.475,15.576,15.677,15.778,15.879,15.98,16.087,16.194,16.301,
		16.408,16.515,16.622,16.729,16.836,16.943,17.05,17.163,17.276,17.389,17.502,17.615,17.728,
		17.841,17.954,18.067,18.18,18.299,18.418,18.537,18.656,18.775,18.894,19.013,19.132,19.251,19.37,
		19.496,19.622,19.748,19.874,20,20.126,20.252,20.378,20.504,20.63,20.764,20.898,21.032,21.166,
		21.3,21.434,21.568,21.702,21.836,21.97,22.111,22.252,22.393,22.534,22.675,22.816,22.957,23.098,
		23.239,23.38,23.529,23.678,23.827,23.976,24.125,24.274,24.423,24.572,24.721,24.87,25.026,25.182,
		25.338,25.494,25.65,25.806,25.962,26.118,26.274,26.43,26.596,26.762,26.928,27.094,27.26,27.426,
		27.592,27.758,27.924,28.09,28.264,28.438,28.612,28.786,28.96,29.134,29.308,29.482,29.656,29.83,
		30.014,30.198,30.382,30.566,30.75,30.934,31.118,31.302,31.486,31.67,31.863,32.056,32.249,32.442,
		32.635,32.828,33.021,33.214,33.407,33.6,33.804,34.008,34.212,34.416,34.62,34.824,35.028,35.232,
		35.436,35.64,35.856,36.072,36.288,36.504,36.72,36.936,37.152,37.368,37.584,37.8,38.025,38.25,
		38.475,38.7,38.925,39.15,39.375,39.6,39.825,40.05,40.288,40.526,40.764,41.002,41.24,41.478,
		41.716,41.954,42.192,42.43,42.679,42.928,43.177,43.426,43.675,43.924,44.173,44.422,44.671,44.92,
		45.183,45.446,45.709,45.972,46.235,46.498,46.761,47.024,47.287,47.55,47.825,48.1,48.375,48.65,
		48.925,49.2,49.475,49.75,50.025,50.3,50.589,50.878,51.167,51.456,51.745,52.034,52.323,52.612,
		52.901,53.19,53.494,53.798,54.102,54.406,54.71,55.014,55.318,55.622,55.926,56.23
	];

	let tempIterateur = 10;
/*let finTempIterateur = 35;
	let iterateur = 0;

	while(tempIterateur <= finTempIterateur && pression == 0){
		if(temp > tempIterateur - 0.05 && temp <= tempIterateur + 0.05){
				pression = tabPressionSaturante[iterateur];
		}else{
				iterateur++;
				tempIterateur += 0.1;
		}
	} */

	let result = tabPressionSaturante.find(
		(value, index) => 
			temp > (tempIterateur + .1*index) - .05 && temp <= (tempIterateur + .1*index) + .05);

	pression = result ? result : 0
	return pression;
}

export async function mesureSec(){
	try {
		let valueMesure = await gpioCan(gpioSec, 180);
		valueMesure *= 40;
		dataHum.temperatureSec=valueMesure+dataHum.etalSec; 

		if(dataHum.temperatureSec < 10 || dataHum.temperatureSec > 40){
			throw new Error('Probleme de Temperature Sec');
		}else{
			return dataHum.temperatureSec;
		}
	} catch(error) {
		logger.error(`Erreur Mesure Sec : ${error}`)
		throw error;
	};
}

export async function mesureHum(){
	try {
		await delay(90);
		let valueMesure = await gpioCan(gpioHum, 90)
		valueMesure *=40;
		dataHum.temperatureHum=valueMesure+dataHum.etalSec;

		if(dataHum.temperatureHum < 10 || dataHum.temperatureHum > 40){
			throw new Error('Probleme de Temperature Hum');
		}else{
			// resolve(Number(valueMesure));
			return dataHum.temperatureHum;
		}
	} catch (error){
		logger.info(`Erreur Mesure Sec : ${error}`)
		throw error;
	}
}


export async function descenteHum(pas: number){
	dataHum.pasHum = pas;

	if (dataHum.consigneHum!=dataHum.consigneattendu) {
		let deltapas=dataHum.consigneattendu-dataHum.consigneHum;
		if (deltapas>0) {
			dataHum.consigneHum=dataHum.consigneHum+pas;
		}
		else if (deltapas<0) {
			dataHum.consigneHum=dataHum.consigneHum-pas;
		}
		
	} else {
		Socket.emit('descente/montée pas activer', '')
	}
	/*
	let deltapas=0;
	
	let tempsPas = 12 * 3600000
	
	let descente = setInterval(() => {
		if (dataHum.consigneHum!=dataHum.consigneattendu){
			deltapas=dataHum.consigneattendu-dataHum.consigneHum;
			if (deltapas>0){
				dataHum.consigneHum=dataHum.consigneHum+pas;
			}
			else if (deltapas<0){
				dataHum.consigneHum=dataHum.consigneHum-pas;
			}
			else {
				Socket.emit('descente/montée pas activer', '')
			}
		}
		return dataHum.consigneHum
	}, tempsPas)
	*/
}
export function actionHum(){
	deltaHum = dataHum.tauxHumidite - dataHum.consigneHum;
	if (deltaHum<0){
		switchRelay(gpioBrume, 0, 120)
		.catch((err) => {
				logger.error('Probleme ouverture brume');
		})
	}
	else if (deltaHum>=0){
		logger.info('humidite trop elever ');
	}
}
// Socket.emit('Temperature ~= consigne, Aucune Action',procedure);
