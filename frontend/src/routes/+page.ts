/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	async function getAssets(): Promise<{ asset: string; free: number; locked: number; freeze: number; withdrawing: number; ipoable: number; btcValuation: number }[]> {
		return await fetch('/api/assets').then((d) => d.json())
	}
	async function getBTCapi(): Promise<{ mins: number; price: number; closeTime: number }> {
		return await fetch('https://api.binance.com/api/v3/avgPrice?symbol=BTCUSDT').then((d) => d.json())
	}
	async function getExchangeInfo(): Promise<any> {
		return await fetch('/api/exchangeInfo').then((d) => d.json())
	}

	return {
		assets: getAssets(),
		BTCapi: getBTCapi(),
		exchangeInfo: getExchangeInfo()
	}
}
