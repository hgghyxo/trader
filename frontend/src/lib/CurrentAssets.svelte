<script lang="ts">
	import type { Assets, BTCapiResponse } from '$lib/types'
	export let assets: Assets[]
	export let BNBinUSD: number, total: number, USDT: number
	export let BTCapi: BTCapiResponse
	import { roundFloatWithPrecision } from '$lib/functions'
	import Test from './test.svelte'

	function createElement(e: MouseEvent) {
		//@ts-ignore
		const target = e.target.parentElement
		target.append(Test)
	}


</script>

<div class="py-2 text-xl font-bold">Current Assets:</div>

<div class="flex">
	<div class="mr-10 text-lg">Total ${roundFloatWithPrecision(total * BTCapi.price)}</div>
	<div class="mr-10 text-green-600">USDT ${roundFloatWithPrecision(USDT)}</div>
	<div class={BNBinUSD > 1 ? 'text-green-600' : 'text-red-600'}>BNB ${roundFloatWithPrecision(BNBinUSD)}</div>
</div>

<table class="w-full">
	<tr>
		<th class="text-left">No</th>
		<th class="text-left">Asset</th>
		<th class="text-left">Free</th>
		<th class="text-left">Locked</th>
		<!-- <th class="text-left">Freeze</th> -->
		<!-- <th class="text-left">Withdrawing</th> -->
		<!-- <th class="text-left">Ipoable</th> -->
		<th class="text-left">Value in USD</th>
		<th></th>
		<th></th>
		<th></th>
	</tr>

	{#each Object.entries(assets) as [key, row]}
		<tr>
			<td>{Number(key) + 1})</td>
			<!-- <td><a class="text-blue-600 hover:underline underline-offset-2" href="https://www.binance.com/en/trade/{row.asset}USDT" target="_blank" rel="noreferrer">{row.asset}</a></td> -->
			<td><a class="text-blue-600 hover:underline underline-offset-2" href="/{row.asset}">{row.asset}</a></td>

			<!-- <button class="p-2 rounded border hover:bg-red-300" on:click={createElement}>TEST</button> -->
			<!-- <Test asset={row.asset}></Test> -->

			<td>{row.free}</td>
			<td>{row.locked}</td>
			<!-- <td>{row.freeze}</td> -->
			<!-- <td>{row.withdrawing}</td> -->
			<!-- <td>{row.ipoable}</td> -->
			<td> ${roundFloatWithPrecision(row.btcValuation * BTCapi.price)}</td>
			<td><input class="rounded border" value="" /></td>
			<td><button class="w-20 flex-shrink-0 rounded border p-2 hover:bg-green-600 hover:text-white dark:border-violet-500">Buy</button></td>
			<td><button class="w-20 flex-shrink-0 rounded border p-2 hover:bg-red-600 hover:text-white dark:border-violet-500">Sell</button></td>
		</tr>
	{/each}
</table>
