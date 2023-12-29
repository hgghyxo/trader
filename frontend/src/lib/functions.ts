import { invalidateAll } from '$app/navigation'

export const roundFloatWithPrecision = (number: any, precision = 2) => Number.parseFloat(number).toFixed(precision)
export const converToDateString = (date: string) => new Date(date).toLocaleDateString('hu-HU')
export const converToTimeString = (date: string) => new Date(date).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })
export const reset = () => invalidateAll()

// export function createPromise(handler: Function) {
// 	let resolve, reject

// 	var promise = new Promise((_resolve, _reject) => {
// 		resolve = _resolve as Function
// 		reject = _reject as Function
// 		if (handler) handler(resolve, reject)
// 	})

// 	interface Promise2 extends Promise<any> {
// 		resolve: Function
// 		reject: Function
// 	}
// 	promise.resolve = resolve
// 	promise.reject = reject
// 	return promise as Promise2
// }
