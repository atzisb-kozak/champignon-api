import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import Socket from 'socket';

let listRelayActif: number[] = [];

export function cleanUp() {
	let cleanUp = spawn("python", ['raspberry/cleanUp.py']);

	cleanUp.stdout.on('data', (data: any) => {
			//console.log("cleanUp.stdout", data)
	});

	cleanUp.stderr.on('data', (data: any) => {
			//console.log(data)
	});

	cleanUp.on('close', (code: any) => {
			// console.log(`Fin gpioCan ${gpio}`);
	});
}

export function getStateRelay(){
	listRelayActif.forEach(element => {
		switch (element) {
			case 41:
				Socket.emit("relayVentilo", 1);
				break;

			case 15:
				Socket.emit("relayVanneAir", 1);
				break;

			case 36:
				Socket.emit("relayBrume", 1);
				break;

			default:
				break;
		}
	});

	if(listRelayActif.indexOf(41) == -1){
		Socket.emit("relayVentilo", 0);
	}
	if(listRelayActif.indexOf(15) == -1){
		Socket.emit("relayVanneAir", 0);
	}
	if(listRelayActif.indexOf(36) == -1){
		Socket.emit("relayBrume", 0);
	}
}

export async function switchRelay(gpio: number, etat: number, duree?: number){

	console.log("Debut activation relay (" + gpio + "), duree " + duree, "etat", etat);
	if(listRelayActif.indexOf(gpio)){
		listRelayActif.push(gpio);
	}

	let python: ChildProcessWithoutNullStreams;
	if(etat == 0) {
		python = spawn("python", ['raspberry/relayOn.py', gpio.toString()]);
		switch (gpio) {
			case 41:
				Socket.emit("relayVentilo", 1);
				break;
			case 15:
				Socket.emit("relayVanneAir", 1);
				break;
			case 36:
				Socket.emit("relayBrume", 1);
				break;
			default:
				break;
		}

		if(duree) {
			setTimeout(() => {
				python = spawn("python", ['raspberry/relayOff.py', gpio.toString()]);
				switch (gpio) {
					case 41:
						Socket.emit("relayVentilo", 0);
						break;
					case 15:
						Socket.emit("relayVanneAir", 0);
						break;
					case 36:
						Socket.emit("relayBrume", 0);
						break;        
					default:
						break;
				}
			}, duree * 1000);
		}
	}else{
		python = spawn("python", ['raspberry/relayOff.py', gpio.toString()]);
		switch (gpio) {
			case 41:
				Socket.emit("relayVentilo", 0);
				break;
			case 15:
				Socket.emit("relayVanneAir", 0);
				break;
			case 36:
				Socket.emit("relayBrume", 0);
				break;        
			default:
				break;
		}
	}

	python.stdout.on('data', (data: any) => {
		console.log("Fin activation relay (" + gpio + ")");
		var index = listRelayActif.indexOf(gpio);
		if (index !== -1) {
			listRelayActif.splice(index, 1);
		}
	});

	python.stderr.on('data', (data: any) => {

	});

	python.on('close', (data: any) => {

	});
}

export async function gpioCan(gpio: any, nbMesure: any){

	let python: ChildProcessWithoutNullStreams;
	let result: number = 0;

	python = spawn("python", ['raspberry/anal.py', gpio, nbMesure]);

	python.stdout.on('data', (data: any) => {
		result = parseFloat(data);
	});
				
	python.stderr.on('data', (data: any) => {
		throw new Error(data);
	});
				
	python.on('close', (code: any) => {
		// console.log(`Fin gpioCan ${gpio}`);
	});

	return result;
}

export function writePin(gpio: number, val: any, duree: any){
	let python: ChildProcessWithoutNullStreams;
	python = spawn("python", ['raspberry/variateur.py', gpio, val, duree]);

	python.stdout.on('data', (data: any) => {

	});

	python.stderr.on('data', (data: any) => {

	});

	python.on('close', (code: any) => {
		// console.log(`Fin gpioCan ${gpio}`);
	});
}
