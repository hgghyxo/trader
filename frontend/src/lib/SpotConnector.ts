import { BinanceSpotClient_key, BinanceSpotClient_secret } from '$env/static/private'
import { Spot } from '@binance/connector-typescript'

export const SpotClient = new Spot(BinanceSpotClient_key, BinanceSpotClient_secret)
