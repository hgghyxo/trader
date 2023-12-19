import type { Timestamp } from '@firebase/firestore-types'

export type OpenOrder = {
	buyPrice: Number
	orderId: Number
	quantity: Number
	symbol: String
	timestamp: Timestamp
}

export type Assets = { asset: string; free: number; locked: number; freeze: number; withdrawing: number; ipoable: number; btcValuation: number }
export type BTCapiResponse = { mins: number; price: number; closeTime: number }
