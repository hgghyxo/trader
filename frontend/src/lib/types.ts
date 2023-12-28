import type { Timestamp } from '@firebase/firestore-types'

export type OpenOrder = {
	buyPrice: number
	orderId: number
	quantity: number
	symbol: string
	timestamp: Timestamp
}

export type Assets = { asset: string; free: number; locked: number; freeze: number; withdrawing: number; ipoable: number; btcValuation: number }
export type BTCapiResponse = { mins: number; price: number; closeTime: number }

export type MergedOrder = {
	asset: string
	free: number
	locked: number
	freeze: number
	withdrawing: number
	ipoable: number
	btcValuation: number
	buyPrice: number
	orderId: number
	quantity: number
	symbol: string
	timestamp: Timestamp
}

export type TabOptions = { value: number; title: string }
