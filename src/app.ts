import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import Socket from './socket';
import { createConnection } from 'typeorm';

async function startServer() {
	const connection = await createConnection()
	const port=3000;
	const app = express();
	app.use(cors({
		credentials: true,
		origin: 'http://localhost',
		methods: ['GET', 'POST'],
	}));

	const gestionAir = await import ('./gestionAir');
	const gestionCo2 = await import ('./gestionCo2');
	const gestionHum = await import ('./gestionHum');


	const server = createServer(app);
	const socket = Socket.setup(server);

	app.get('/gestionAir', (req, res) => {
		return gestionAir.gestionAir();
	});

	app.get('/descenteAir', (req, res) =>{
		return gestionAir.descenteAir(req.body.pas);
	});

	app.get('/mesureAir', async (req, res) => {
		const value = await gestionAir.mesureAir()

		res.send(value);
	});

	app.get('/mesureSec', async (req, res) => {
		const value = await gestionHum.mesureSec()

		res.send(value);
	});

	app.get('/mesureHum', async (req, res) => {
		const value = await gestionHum.mesureHum()

		res.send(value);
	});

	app.get('/gestionHum', (req, res) => {
		return gestionHum.gestionHum(req.body.mesureSec, req.body.mesureHum);
	});

	app.get('/descenteHum', (req, res) => {
		return gestionHum.descenteHum(req.body.pas);
	});

	app.get('/gestionCo2', (req, res) => {
		return gestionCo2.gestionCo2();
	});

	app.get('/descenteCo2', (req, res) => {
		return gestionCo2.descenteCo2(req.body.pas);
	});

	server.listen(port, () => {
		console.log('lancement serveur');
	});
}

startServer()