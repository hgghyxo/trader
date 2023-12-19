<script lang="ts">
	import { db } from '$lib/firebase'
	import { onSnapshot, collection, query, orderBy } from 'firebase/firestore'
	import type { OpenOrder, Assets } from '$lib/types'

	export let assets: Assets[] = []

	let currentOpenOrders: OpenOrder[] = []

	const q = query(collection(db, 'currentOpenOrders'), orderBy('timestamp', 'desc'))

	onSnapshot(q, (querrySnapshot) => {
		const data: OpenOrder[] = []
		querrySnapshot.forEach((doc) => {
			data.push(doc.data() as OpenOrder)
		})
		currentOpenOrders = data
	})
</script>

<div class="py-2 text-xl font-bold">Current Open Orders:</div>
<table class="min-w-max">
	<tr>
		<th>Symbol</th>
		<th>Quantity</th>
		<th>Price</th>
		<th>Timestamp</th>
	</tr>
	{#each currentOpenOrders as order}
		<tr>
			<td>{order.symbol} </td>
			<td>{order.quantity}</td>
			<td>{order.buyPrice} </td>
			<td>{new Date(order.timestamp.toDate()).toDateString()}</td>
		</tr>
	{/each}
</table>
