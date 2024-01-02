import { invalidateAll } from '$app/navigation'

export const roundFloatWithPrecision = (number: any, precision = 2) => Number.parseFloat(number).toFixed(precision)
export const converToDateString = (date: string | number | Date) => new Date(date).toLocaleDateString('hu-HU')
export const converToTimeString = (date: string | number | Date) => new Date(date).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })
export const reset = () => invalidateAll()

export function createPromise(handler: Function | undefined = undefined) {
	let resolve, reject

	var promise = new Promise((_resolve, _reject) => {
		resolve = _resolve as Function
		reject = _reject as Function
		if (handler) handler(resolve, reject)
	})

  Object.assign(promise, { resolve, reject })

	interface ExtendedPromise extends Promise<unknown> {
		resolve: Function
		reject: Function
	}

	return promise as ExtendedPromise
}
