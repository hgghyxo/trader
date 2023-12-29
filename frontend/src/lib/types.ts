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
export type Fills = { commission: string; commissionAsset: string; price: string; qty: string; tradeId: number }
export type OrderHistory = {
	clientOrderId: string
	cummulativeQuoteQty: string
	executedQty: string
	fills: Fills[]
	orderId: number
	orderListId: number
	origQty: string
	price: string
	selfTradePreventionMode: string
	side: string
	status: string
	symbol: string
	timeInForce: string
	timestamp: Timestamp
	transactTime: number
	type: string
	workingTime: number
}
