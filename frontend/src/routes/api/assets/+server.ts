import { BinanceSpotClient_key, BinanceSpotClient_secret } from '$env/static/private'
import { Spot } from '@binance/connector'
import { json } from '@sveltejs/kit'

const client = new Spot(BinanceSpotClient_key, BinanceSpotClient_secret)

export async function GET() {
  const response = await client
    .userAsset({ needBtcValuation: true })
    .then((response) => response.data)
    .catch((error) => client.logger.error(error))
  return json(response)
}
