import { timeString } from '@constant/time'

type TimeUnit = 'seconde' | 'minute' | 'heure';

export function delay(time: number, unit: TimeUnit = 'seconde') {
	return Promise.resolve(setTimeout(() => {}, time * timeString[unit]));
};