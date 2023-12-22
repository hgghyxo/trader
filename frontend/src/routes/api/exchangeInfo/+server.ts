import { BinanceSpotClient_key, BinanceSpotClient_secret } from '$env/static/private'
import { Spot } from '@binance/connector-typescript'
import { json } from '@sveltejs/kit'

const client = new Spot(BinanceSpotClient_key, BinanceSpotClient_secret)

export async function GET() {
	const response = await client.exchangeInformation().then((response) => response)
	return json(response)
}
