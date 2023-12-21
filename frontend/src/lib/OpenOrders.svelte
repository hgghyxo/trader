<script lang="ts">
	import { db } from '$lib/firebase'
	import { roundFloat } from '$lib/functions'
	import type { Assets, BTCapiResponse, MergedOrder, OpenOrder } from '$lib/types'
	import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
	export let assets: Assets[] = []
	export let BTCapi: BTCapiResponse

	let MergedOpenOrders: MergedOrder[] = []

	const q = query(collection(db, 'currentOpenOrders'), orderBy('timestamp', 'desc'))

	onSnapshot(q, (querrySnapshot) => {
		const temp: MergedOrder[] = []

		querrySnapshot.forEach((doc) => {
			const data = doc.data() as OpenOrder
			const asset = assets.filter((a) => a.asset == data.symbol.slice(0, -4))
			const temp2 = { ...data, ...asset[0] }


			temp.push(temp2)
		})
		MergedOpenOrders = temp
	})
</script>

<div class="py-2 text-xl font-bold">Tracked Open Orders:</div>
<table class="w-full">
	<tr>
		<th class="text-left">Symbol</th>
		<th class="text-left">Tracked</th>
		<th class="text-left">Buy Price</th>
		<th class="text-left">Timestamp</th>
	</tr>
	{#each MergedOpenOrders as order}
		<tr>
			<td><a class="text-blue-600 hover:underline" href="https://www.binance.com/en/trade/{order.symbol}" target="_blank" rel="noreferrer">{order.symbol}</a></td>
			<td>{order.quantity}</td>
			<td>{(order.buyPrice)} </td>

			<td>{new Date(order.timestamp.toDate()).toDateString()}</td>
		</tr>
	{/each}
</table>
