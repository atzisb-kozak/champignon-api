import { Server } from 'socket.io';

const socket = {
	io: new Server(),
	setup: (server: any) => {
		socket.io = new Server(server, {
			cors: {
				credentials: true,
				origin: 'http://localhost',
				methods: ['GET', 'POST'],
			},
		})
		socket.io.on('connection', socket => {})
		return socket.io;
	}, 

	emit: (label: string, value: string | number) => {
		socket.io.emit(label, value)
	}
}

export default socket;