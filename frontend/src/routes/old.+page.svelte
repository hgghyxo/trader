<script lang="ts">
	import CurrentAssets from '$lib/CurrentAssets.svelte'
	import Settings from '$lib/Settings.svelte'
	import TabButton from '$lib/TabButton.svelte'
	import BannedSymbols from '$lib/bannedSymbols.svelte'
	import { invalidateAll } from '$app/navigation'
	import { db } from '$lib/firebase'
	import { converToDateString, converToTimeString, roundFloatWithPrecision } from '$lib/functions'
	import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
	import '../app.css'
	import OpenOrders from '$lib/OpenOrders.svelte'
	export let data
	import { onMount } from 'svelte'

	let tab = 1
	let total: number
	let BNB: number
	let USDT: number
	let BUSD: number
	let totalByDate = Object()
	let ordersByDate = Object()
	let totalBySymbol = Object()
	let ordersBySymbol = Object()
	let orderHistory: any = []
	let exchangeInfo

	const orderHistory_Ref = collection(db, 'orderHistory')
	const q = query(orderHistory_Ref, orderBy('timestamp', 'desc'), limit(100))

	onMount(() => {
		if (localStorage.getItem('tab')) {
			tab = Number(localStorage.getItem('tab'))
		}
	})

	onSnapshot(q, (snapshot) => {
		orderHistory = []
		snapshot.forEach((doc) => {
			orderHistory.push(doc.data())
		})
	})

	$: {
		total = 0
		BNB = 0
		USDT = 0
		BUSD = 0

		data.assets.forEach((asset) => {
			total = total + Number(asset.btcValuation)
			if (asset.asset == 'BUSD') {
				BUSD = asset.btcValuation * data.BTCapi.price
			}
			if (asset.asset == 'BNB') {
				BNB = asset.btcValuation * data.BTCapi.price
			}
			if (asset.asset == 'USDT') {
				USDT = asset.btcValuation * data.BTCapi.price
			}
		})

		orderHistory.forEach((order) => {
			const date = converToDateString(order.transactTime)
			ordersByDate[date] = orderHistory.filter((filtered) => converToDateString(filtered.transactTime) == date)
		})

		Object.keys(ordersByDate).forEach((date) => {
			totalByDate[date] = Number()

			ordersByDate[date].forEach((order) => {
				if (order.type !== 'TAKE_PROFIT_LIMIT') {
					if (order.side === 'BUY') {
						totalByDate[date] = -Number(order.cummulativeQuoteQty)
					} else {
						totalByDate[date] = +Number(order.cummulativeQuoteQty)
					}
				}
			})
		})

		orderHistory.forEach((order) => {
			ordersBySymbol[order.symbol] = orderHistory.filter((filtered) => filtered.symbol === order.symbol)
		})

		Object.keys(ordersBySymbol).forEach((symbol) => {
			totalBySymbol[symbol] = Number()

			ordersBySymbol[symbol].forEach((order) => {
				if (order.type !== 'TAKE_PROFIT_LIMIT') {
					if (order.side === 'BUY') {
						totalBySymbol[symbol] = -Number(order.cummulativeQuoteQty)
					} else {
						totalBySymbol[symbol] = +Number(order.cummulativeQuoteQty)
					}
				}
			})
		})
	}

	const options = [
		{ title: 'Transactions by Date', value: 1 },
		{ title: 'Transactions by Symbol', value: 2 },
		{ title: 'Current Open Orders', value: 3 },
		{ title: 'Current Assets', value: 4 },
		{ title: 'Settings', value: 5 }
	]

	function reset() {
		invalidateAll()
	}
</script>

<div class="min-w-fit bg-white text-lg text-gray-900 dark:bg-gray-900 dark:text-white">
	<main class="mx-auto w-fit sm:min-w-[1280px]">
		<nav class="w-full border-gray-200 p-2.5 px-2">
			<div class=" flex flex-row rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm dark:border-gray-700 dark:bg-gray-800 md:mt-0">
				<a href="https://www.binance.com/en/my/wallet/account/main" target="_blank" rel="noreferrer" class=" mp-0 block bg-transparent p-2 hover:text-blue-600"> Account</a>
				<button class="ml-6 p-2 text-blue-600 underline-offset-2 hover:underline" on:click={reset}>Reload</button>
				<div class="m-auto"></div>
				<div class="p-2">Total ${roundFloatWithPrecision(total * data.BTCapi.price)}</div>
				<div class="p-2 text-green-600">USDT ${roundFloatWithPrecision(USDT)}</div>
			</div>
		</nav>

		<TabButton tabOptions={options} bind:tab></TabButton>

		<!-- <section class="block px-4" class:hidden={tab !== 1}>
			<h1 class="py-2 text-xl font-bold">Transactions by Date:</h1>
			{#each Object.entries(ordersByDate) as [date, orders]}
				<h3 class="py-2 font-bold {totalByDate[date] > 0 ? 'text-green-600' : 'text-red-600'}">
					{date} (${roundFloat(totalByDate[date])}):
				</h3>

				{#each orders as order}
					<div class="px-2 {order.side == 'BUY' ? 'text-red-600' : 'text-green-600'}">
						{converToTime(order.transactTime)} -
						{order.side}
						{order.type}
						<a href="https://www.binance.com/en/trade/{order.symbol}" target="_blank" rel="noreferrer">{order.symbol}</a>
						{order.cummulativeQuoteQty}
					</div>
				{/each}
			{/each}
		</section> -->

		<!-- <section class="block px-4" class:hidden={tab !== 2}>
			<h1 class="py-2 text-xl font-bold">Transactions by Symbol:</h1>
			{#each Object.entries(ordersBySymbol) as [symbol, orders]}
				<h3 class="py-2 font-bold {totalBySymbol[symbol] > 0 ? 'text-green-600' : 'text-red-600'}">
					<a href="https://www.binance.com/en/trade/{symbol}" target="_blank" rel="noreferrer">{symbol}</a>
					(${roundFloat(totalBySymbol[symbol])}):
				</h3>

				{#each orders as order}
					<div class="px-2 {order.side == 'BUY' ? 'text-red-600' : 'text-green-600'}">
						{converToDate(order.transactTime)}
						{order.side}
						<a href="https://www.binance.com/en/trade/{order.symbol}" target="_blank" rel="noreferrer">{order.symbol}</a>
						{order.cummulativeQuoteQty}
					</div>
				{/each}
			{/each}
		</section> -->

		<section class="px-4" class:hidden={tab !== 3}>
			<OpenOrders assets={data.assets} BTCapi={data.BTCapi} />
		</section>

		<section class=" px-4" class:hidden={tab !== 4}>
			<CurrentAssets assets={data.assets} BNBinUSD={BNB} {total} {USDT} BTCapi={data.BTCapi} />
		</section>

		<section class="px-4" class:hidden={tab !== 5}>
			<Settings />
			<BannedSymbols />
		</section>

		<div class="p-56"></div>
	</main>
</div>
