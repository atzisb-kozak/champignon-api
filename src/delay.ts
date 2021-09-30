import { timeString } from '@constant/time'

type TimeUnit = 'seconde' | 'minute' | 'heure';

/**
 * awaiting timed function, use to wait between 2 process
 *
 * @export
 * @param {number} time Time time to wait 
 * @param {TimeUnit} [unit='seconde'] Time unit (second, hours, minute)
 * @return {*}  {Promise<NodeJS.Timeout>}
 */
export function delay(time: number, unit: TimeUnit = 'seconde'): Promise<NodeJS.Timeout> {
	return Promise.resolve(setTimeout(() => {}, time * timeString[unit]));
};