export function roundFloat(number: any, precision = 2) {
	return Number.parseFloat(number).toFixed(precision)
}
export function converToDate(date: string) {
	return new Date(date).toLocaleDateString('hu-HU')
}
export function converToTime(date: string) {
	return new Date(date).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })
}
