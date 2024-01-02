<script lang="ts">
	import { db } from '$lib/firebase'
	import { collection, onSnapshot, orderBy, query, where, limit, getDocs } from 'firebase/firestore'
	import type { OpenOrder, OrderHistory } from '$lib/types'
	import { converToDateString, converToTimeString, roundFloatWithPrecision } from '$lib/functions'
	let CurrentOpenOrders: OpenOrder[] = []
	let OrderHistory: OrderHistory[] = []
	export let asset: string

	const q = query(collection(db, 'currentOpenOrders'), where('symbol', '==', asset.toUpperCase() + 'USDT'), limit(100))
	const q2 = query(collection(db, 'orderHistory'), where('symbol', '==', asset.toUpperCase() + 'USDT'), limit(100))

	getDocs(q).then((querrySnapshot) => {
		CurrentOpenOrders = []
		querrySnapshot.forEach((doc) => {
			const data = doc.data() as OpenOrder
			CurrentOpenOrders.push(data)
		})
		CurrentOpenOrders.sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
	})

	getDocs(q2).then((querrySnapshot) => {
		OrderHistory = []
		querrySnapshot.forEach((doc) => {
			const data = doc.data() as OrderHistory
			OrderHistory.push(data)
		})
		OrderHistory.sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
	})
</script>

<div>
	<table class="w-full">
		<tr>
			<th class="text-left">Symbol</th>
			<th class="text-left">Tracked</th>
			<th class="text-left">Buy Price</th>
			<th class="text-left">Timestamp</th>
		</tr>
		{#each CurrentOpenOrders as order}
			<tr>
				<td><a class="text-blue-600 hover:underline" href="https://www.binance.com/en/trade/{order.symbol}" target="_blank" rel="noreferrer">{order.symbol}</a></td>
				<td>{order.quantity}</td>
				<td>{order.buyPrice} </td>
				<td>{new Date(order.timestamp.toDate()).toDateString()}</td>
			</tr>
		{/each}
	</table>

	{#each OrderHistory as Orders}
		<p class={Orders.side == 'BUY' ? 'text-red-600' : 'text-green-600'}>
			{converToDateString(Orders.transactTime)}
			{converToTimeString(Orders.transactTime)}
			{Orders.type}
			{Orders.status}
			<span class="font-bold">{Orders.side}</span>
			<a class="hover:text-blue-600 hover:underline underline-offset-2" href="https://www.binance.com/en/trade/{Orders.symbol}" target="_blank" rel="noreferrer">{Orders.symbol}</a>
			{roundFloatWithPrecision(Orders.cummulativeQuoteQty)}
		</p>
	{/each}
</div>
