<script>
	import Settings from '../lib/Settings.svelte'
	import { db } from '$lib/firebase'
	import { onSnapshot, collection, limit, query, orderBy } from 'firebase/firestore'
	import OpenOrders from '../lib/OpenOrders.svelte'
	import TabButton from '$lib/TabButton.svelte'
	import '../app.css'
	export let data

	let tab = 1
	let total
	let BNB
	let USDT
	let totalByDate = Object()
	let ordersByDate = Object()
	let totalBySymbol = Object()
	let ordersBySymbol = Object()
	let orderHistory = []

	const orderHistory_Ref = collection(db, 'orderHistory')
	const q = query(orderHistory_Ref, orderBy('timestamp', 'desc'), limit(100))

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
			const date = converToDate(order.transactTime)
			ordersByDate[date] = orderHistory.filter((filtered) => converToDate(filtered.transactTime) == date)
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

	function roundFloat(number, x = 2) {
		return Number.parseFloat(number).toFixed(x)
	}
	function converToDate(date) {
		return new Date(date).toLocaleDateString('hu-HU')
	}
	function converToTime(date) {
		return new Date(date).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })
	}

	const options = [
		{ title: 'Transactions by Date', value: 1 },
		{ title: 'Transactions by Symbol', value: 2 },
		{ title: 'Current Open Orders', value: 3 },
		{ title: 'Current Assets', value: 4 },
		{ title: 'Settings', value: 5 }
	]
</script>

<main class=" bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-400">
	<nav class="w-full border-gray-200 p-2.5 px-2">
		<div class="mt-4 flex flex-row rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm dark:border-gray-700 dark:bg-gray-800 md:mt-0">

				<a href="https://www.binance.com/en/my/wallet/account/main" target="_blank" rel="noreferrer" class=" mp-0 block bg-transparent p-2 hover:text-blue-600"> Account</a>
        <div class="m-auto"></div>
        <div class="p-2 ">Total ${roundFloat(total * data.BTCapi.price)}</div>
        <div class="p-2 text-green-600">USDT ${roundFloat(USDT)}</div>

    </div>
	</nav>

	<TabButton {options} bind:tab></TabButton>

	<section class="flex px-4" class:hidden={tab !== 5}><Settings /></section>

	<section class="px-4 block" class:hidden={tab !== 1}>
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
	</section>

	<section class="px-4 block" class:hidden={tab !== 2}>
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
	</section>

	<section class="px-4 block" class:hidden={tab !== 3}>
		<OpenOrders />
	</section>

	<section class="px-4 block" class:hidden={tab !== 4}>
		<div class="py-2 text-xl font-bold">Current Assets:</div>
		<div class="text-lg">Total ${roundFloat(total * data.BTCapi.price)}</div>
		<div class="mb-1 text-xs">
			<div class="text-green-600">USDT ${roundFloat(USDT)}</div>
			<div class={BNB > 1 ? 'text-green-600' : 'text-red-600'}>BNB ${roundFloat(BNB)}</div>
		</div>
		{#each Object.entries(data.assets) as [key, row]}
			<p>
				{Number(key) + 1})
				<a href="https://www.binance.com/en/trade/{row.asset}USDT" target="_blank" rel="noreferrer">{row.asset}</a>: ${roundFloat(row.btcValuation * data.BTCapi.price)}
			</p>
		{/each}
	</section>
</main>
