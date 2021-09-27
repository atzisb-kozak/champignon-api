import { createLogger, format, transports } from "winston";
const { combine, timestamp, label, printf } = format

const champignonFormat = printf(({ level, message, timestamp, label}) => 
	`${timestamp} [${label}] ${level}: ${message}`);

export const logger = createLogger({
	level: 'info',
	format: combine(
		label({label: 'Champignon-API'}),
		timestamp(),
		champignonFormat
	),
	transports: [
		new transports.Console({
			level: 'info',
			format: format.combine(
				format.colorize(),
				format.simple()
			)
		}),
		new transports.File({filename: 'error.log', level: 'error'}),
		new transports.File({filename: 'general.log', level: 'info'}),
	]
})
