import { getStateRelay, switchRelay, gpioCan, writePin } from './raspberry/raspberry';
import { sensorTemperature } from '@constant/pin';
import { createAir } from '@database/bdd'
import Socket from 'socket';
import { logger } from 'logger';

interface dataAir{
	etatVanneFroid: number;
	temperatureAir:number;
	temperatureAirNonEtalonner:number;
	consigneAir:number;
	consigneattendu:number;
	etalAir:number;
	pasAir: number;
}

let dataAir: dataAir = {
	etatVanneFroid: 0,
	temperatureAir: 0,
	temperatureAirNonEtalonner: 0,
	consigneAir: 16,
	consigneattendu: 20,
	etalAir: 0,
	pasAir: 0
}

let gpioAir: number = sensorTemperature.gpioAir;
let gpioAirOn: number = sensorTemperature.gpioAirOn;

let gpioAirOff: number = sensorTemperature.gpioAirOff;

let deltaTemp=0;
let dureeAction=0;
let procedure: string = 'Lancement gestion temperature Air';



export async function gestionAir(){
	Socket.emit('etatAir',procedure);
	const mesure = await mesureAir();
	if (mesure !==0) {
		dataAir.temperatureAirNonEtalonner = mesure;
	}
	etalonageAir();
	Socket.emit('',dataAir.temperatureAir);
	logger.info('Mesure Air : ', dataAir.temperatureAir);
	deltaTemp = dataAir.temperatureAir - dataAir.consigneAir;
	dureeAction = dureeRegulationAir(deltaTemp);

	if(dureeAction > 0){
		if(deltaTemp > 0){
			modifVanneAir(dureeAction);
		}else{
			modifVanneAir(-dureeAction);
		}
	}else{
		Socket.emit('Temperature ~= consigne, Aucune Action',procedure);
	}
	await createAir(dataAir)
}


export async function descenteAir(pas: number){
	dataAir.pasAir = pas;
	
	let deltapas=0;

	let tempsPas = 12 * 3600000

	let descente = setInterval(() => {
		if (dataAir.consigneAir!=dataAir.consigneattendu){
			deltapas=dataAir.consigneattendu-dataAir.consigneAir;
			if (deltapas>0){
				dataAir.consigneAir=dataAir.consigneAir+pas;
			}
			else if (deltapas<0){
				dataAir.consigneAir=dataAir.consigneAir-pas;
			}
			else {
				Socket.emit('descente/montée pas activer ', '')
			}
		}
		return dataAir.consigneAir
	}, tempsPas)
}


function etalonageAir(){
	dataAir.temperatureAir=dataAir.temperatureAirNonEtalonner+dataAir.etalAir; 
	return dataAir.temperatureAir;
}

export async function mesureAir(): Promise<number>{
	try{
		let valueMesureAir = await gpioCan(gpioAir, 30)
		logger.info('FMesureAir', valueMesureAir);
		valueMesureAir *= 40;

		if(valueMesureAir < 10 || valueMesureAir > 40){
			return 0;
		}
		return valueMesureAir;
	}catch(err){
		logger.info(err);
		return 0;
	}
}

function dureeRegulationAir(deltaTemp: number){

	if(deltaTemp > 1.5 || deltaTemp < -1.5){
		dureeAction = 40;
	}else if(deltaTemp > 1 || deltaTemp < -1){
		dureeAction = 15;
	}else if(deltaTemp > 0.5 || deltaTemp < -0.5){
		dureeAction = 5;
	}else if(deltaTemp > 0.3 || deltaTemp < -0.3){
		dureeAction = 2;
	}
/*
	if(deltaTemp < -1.5){
		dureeAction = 40;
	}else if(deltaTemp < -1){
		dureeAction = 15;
	}else if(deltaTemp < -0.5){
		dureeAction = 5;
	}else if(deltaTemp < -0.3){
		dureeAction = 2;
	}*/

	return dureeAction;
}


async function modifVanneAir (dureeAction: number) {
	let intVanne: NodeJS.Timer;

	if(dureeAction > 0){
		await switchRelay(gpioAirOff, 0, dureeAction)
		.catch((err) => {
			logger.error('Probleme fermeture Vanne Air');
		})
		await switchRelay(gpioAirOn, 0, dureeAction)
		.catch((err) => {
			logger.error('Probleme ouverture Vanne Air');
		})
		intVanne = setInterval(() => {
				dataAir.etatVanneFroid = dataAir.etatVanneFroid > 40 ? 40 : dataAir.etatVanneFroid+1;
		}, 1000)

		setTimeout(() => {
			clearInterval(intVanne);
		}, (dureeAction + 1) * 1000)
	}else{
		await switchRelay(gpioAirOff, 0, -dureeAction)
		.catch((err: Error) => {
			logger.info('Probleme fermeture Vanne Air', err);
		})
		intVanne = setInterval(() => {
			dataAir.etatVanneFroid = dataAir.etatVanneFroid < 0 ? 0 : dataAir.etatVanneFroid-1;
		}, 1000)

		setTimeout(() => {
			clearInterval(intVanne);
		}, (-dureeAction + 1) * 1000)
	}
	return true;
}