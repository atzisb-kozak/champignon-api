import { Gpio } from 'pigpio'
import { Co2Config } from '@constant/configCo2';
import Socket from 'socket';
import axios from 'axios';
import { logger } from './logger';
import { delay } from './delay';

const salle: string = Co2Config.salle1

interface dataCo2{
	dureeVariateurOff:number;
	consigneCo2:number;
	consigneattendu: number;
	co2:number | null;
	freq:number;
}
let dataCo2:dataCo2 = {
	dureeVariateurOff:60000,
	consigneCo2:2500,
	consigneattendu: 2500,
	co2:null,
	freq:170,
};
let deltaCo2=0;

//setVariateur(0);

export async function gestionCo2(){
	try {
		const response = await axios.get<number>(`http://${Co2Config.ip}:6000/getCO2/${salle}`);
		dataCo2.co2 = response.data;
		console.log('valeurc02 ', dataCo2.co2);
		deltaCo2= dataCo2.co2-dataCo2.consigneCo2;
		if(deltaCo2 > 0){
				dataCo2.dureeVariateurOff += 60000;
				if(dataCo2.dureeVariateurOff > 300000){
						dataCo2.dureeVariateurOff = 300000;
				}
		}
	} catch (error) {
		logger.error('updateTimeVariateur', error);
		logger.error('Acces au Serveur Co2 Master impossible (Mesure Co2)');
	}
}

export async function descenteCo2(pas: number) {

	let deltapas=0;

	let tempsPas = 12 * 3600000

	let descente = setInterval(() => {
		if (dataCo2.consigneCo2!=dataCo2.consigneattendu){
			deltapas=dataCo2.consigneattendu-dataCo2.consigneCo2;
			if (deltapas>0){
				dataCo2.consigneCo2=dataCo2.consigneCo2+pas;
			}
			else if (deltapas<0){
				dataCo2.consigneCo2=dataCo2.consigneCo2-pas;
			}
			else {
				Socket.emit('descente/montée pas activer ', '')
			}
		}
		return dataCo2.consigneCo2
	}, tempsPas)
}

async function gestionVariateur() {
	if (dataCo2.consigneCo2 - dataCo2.consigneCo2 > 0 && dataCo2.freq != 250) {
		dataCo2.freq += 5;
		if (dataCo2.freq > 250) {
			dataCo2.freq = 250;
		}
	} else if (dataCo2.consigneCo2 - dataCo2.consigneCo2 < 0 && dataCo2.freq != 150){
		dataCo2.freq -= 5;
		if (dataCo2.freq < 150) {
			dataCo2.freq = 150;
		}
	} else {
		setVariateur(150);
		await delay(30);
		setVariateur(0);
	}
}

function setVariateur(cycle: number){
	logger.info(`Activation variateur node ${cycle}`);

	const led = new Gpio(12, {mode: Gpio.OUTPUT});

	led.pwmWrite(cycle); 
	
	process.on('SIGINT', function () {
		led.digitalWrite(0);
	});
}