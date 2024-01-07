<script lang="ts">
	import CurrentAssets from '$lib/CurrentAssets.svelte'
	import Settings from '$lib/Settings.svelte'
	import TabButton from '$lib/TabButton.svelte'
	import BannedSymbols from '$lib/bannedSymbols.svelte'
	import { db } from '$lib/firebase'
	import { converToDateString, converToTimeString, roundFloatWithPrecision, reset } from '$lib/functions'
	import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
	import '../app.css'
	import OpenOrders from '$lib/OpenOrders.svelte'
	import type { OrderHistory } from '$lib/types'
	export let data

	let tab = 1
	let total = 0
	let BNBinUSD = 0
	let USDT = 0
	let orderHistory: OrderHistory[] = []

	$: {
		total = 0
		data.assets.forEach((element) => {
			total = total + Number(element.btcValuation)
			if (element.asset == 'BNB') BNBinUSD = element.btcValuation * data.BTCapi.price
			if (element.asset == 'USDT') USDT = element.btcValuation * data.BTCapi.price
		})
		data.assets.sort((a, b) => b.btcValuation - a.btcValuation)
	}

	const orderHistory_Ref = collection(db, 'orderHistory')
	const q = query(orderHistory_Ref, orderBy('timestamp', 'desc'), limit(100))

	onSnapshot(q, (snapshot) => {
		orderHistory = []
		snapshot.forEach((doc) => {
			orderHistory.push(doc.data() as OrderHistory)
		})
	})

	const options = [
		{ title: 'Order History', value: 1 },
		{ title: 'Current Open Orders', value: 2 },
		{ title: 'Current Assets', value: 3 },
		{ title: 'Settings', value: 4 }
	]
</script>

<div class="select-none bg-white text-lg text-gray-900 dark:bg-gray-900 dark:text-white">
	<main class="mx-auto sm:min-w-[1280px]">
		<nav class="w-full border-gray-200 pb-2.5">
			<div class="flex flex-row rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm dark:border-gray-700 dark:bg-gray-800 md:mt-0">
				<a href="https://www.binance.com/en/my/wallet/account/main" target="_blank" rel="noreferrer" class=" mp-0 block bg-transparent p-2 hover:text-blue-600"> Account</a>
				<button class="ml-6 p-2 text-blue-600 underline-offset-2 hover:underline" on:click={reset}>Reload</button>
				<div class="m-auto"></div>
				<div class="p-2">Total ${roundFloatWithPrecision(total * data.BTCapi.price)}</div>
				<div class="p-2 text-green-600">USDT ${roundFloatWithPrecision(USDT)}</div>
			</div>
		</nav>

		<TabButton tabOptions={options} bind:tab></TabButton>

		<section class="px-4" class:hidden={tab !== 1}>
			<h1 class="pt-6 text-2xl font-bold">Order History:</h1>
			{#each orderHistory as Orders}
				<p class={Orders.side === 'BUY' ? 'text-red-600' : 'text-green-600'}>
					{converToDateString(Orders.transactTime)}
					{converToTimeString(Orders.transactTime)}
					<span class="font-bold">{Orders.side}</span>
					<a class="hover:text-blue-600 hover:underline underline-offset-2" href="https://www.binance.com/en/trade/{Orders.symbol}" target="_blank" rel="noreferrer">{Orders.symbol}</a>
					{roundFloatWithPrecision(Orders.cummulativeQuoteQty)}
				</p>
			{/each}
		</section>

		<section class="px-4" class:hidden={tab !== 2}>
			<OpenOrders assets={data.assets} BTCapi={data.BTCapi} />
		</section>

		<section class="px-4" class:hidden={tab !== 3}>
			<CurrentAssets assets={data.assets} {BNBinUSD} {total} {USDT} BTCapi={data.BTCapi} />
		</section>

		<section class="px-4" class:hidden={tab !== 4}>
			<Settings />
			<BannedSymbols />
		</section>

		<!-- <div class="py-56"></div> -->
	</main>
</div>
