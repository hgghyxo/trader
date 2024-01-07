<script lang="ts">
	import { db } from './firebase'
	import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
	import SettingsSlider from './settingsSlider.svelte'

	let minimumKeepAmmount: number,
		minimalBuyAmmountInUSD: number,
		sellMargin: number,
		trailingDelta: number,
		LastHourPricePercentChanged: number,
		SellWithTakeProfitLimitOrder: boolean = true,
		hoursToBanSymbols: number,
		useBanSymbols: boolean = true,
		whitelist_array: Set<string> = new Set(),
		newWhiteListSymbol: string,
		useWhiteList: boolean

	const loading = load()

	function load() {
		let resolve: any = undefined
		const promise: any = new Promise((r) => (resolve = r))
		const done = () => resolve()
		const wait = () => promise

		return { done, wait }
	}

	const settingsRef = doc(db, 'backend/settings')

	const update = (event: any) => {
		let updated
		if (event.target.type == 'checkbox') {
			updated = JSON.parse('{"' + event.target.name + '":' + event.target.checked + '}')
		} else {
			updated = JSON.parse('{"' + event.target.name + '":' + event.target.value + '}')
		}
		updateDoc(settingsRef, updated)
	}

	onSnapshot(settingsRef, (doc) => {
		const settings = doc.data()
		loading.done()

		if (settings) {
			minimumKeepAmmount = settings.minimumKeepAmmount
			minimalBuyAmmountInUSD = settings.minimalBuyAmmountInUSD
			sellMargin = settings.sellMargin
			trailingDelta = settings.trailingDelta
			LastHourPricePercentChanged = settings.LastHourPricePercentChanged
			SellWithTakeProfitLimitOrder = settings.SellWithTakeProfitLimitOrder
			hoursToBanSymbols = settings.hoursToBanSymbols
			useBanSymbols = settings.useBanSymbols
			useWhiteList = settings.useWhiteList
			whitelist_array = new Set(settings.whitelist)
		}
	})

	function addWhitelist() {
		whitelist_array.add(newWhiteListSymbol.toLocaleUpperCase())
		newWhiteListSymbol = ''
		updateDoc(settingsRef, { whitelist: Array.from(whitelist_array) })
	}

	function removeWhiteListItem(whitelist_item: string) {
		whitelist_array.delete(whitelist_item)
		updateDoc(settingsRef, { whitelist: Array.from(whitelist_array) })
	}
</script>

{#await loading.wait()}
	Loading ...
{:then}
	<form on:change={update} class="">
		<SettingsSlider name="minimalBuyAmmountInUSD" min="10" max="100" value={minimalBuyAmmountInUSD} />
		<SettingsSlider name="minimumKeepAmmount" min="0" max="999" value={minimumKeepAmmount} />
		<SettingsSlider name="sellMargin" min="0.01" max="1" step="0.01" value={sellMargin} customTitle="Sell Margin is at {sellMargin * 100}% now" />
		<SettingsSlider name="LastHourPricePercentChanged" min="1" max="20" value={LastHourPricePercentChanged} />

		<label class="block">
			<input class="m-2" name="useBanSymbols" type="checkbox" bind:checked={useBanSymbols} />useBanSymbols
		</label>

		{#if useBanSymbols}
			<SettingsSlider name="hoursToBanSymbols" min="0" max="48" value={hoursToBanSymbols} />
		{/if}

		<label class="block">
			<input class="m-2" name="SellWithTakeProfitLimitOrder" type="checkbox" bind:checked={SellWithTakeProfitLimitOrder} />SellWithTakeProfitLimitOrder
		</label>

		{#if SellWithTakeProfitLimitOrder}
			<SettingsSlider name="trailingDelta" min="100" max="500" step="100" value={trailingDelta} />
		{/if}

		<label class="block">
			<input class="m-2" name="useWhiteList" type="checkbox" bind:checked={useWhiteList} />useWhiteList
		</label>
	</form>

	{#if useWhiteList}
		<h1 class="pt-6 text-2xl font-bold">WhiteList:</h1>
		<div class="mb-2">
			<form class="mb-2 flex" on:submit|preventDefault={addWhitelist}>
				<input class="flex-shrink border p-2 dark:text-black sm:mr-2" name="symbol" bind:value={newWhiteListSymbol} placeholder="Symbol" />
				<button class="w-28 flex-shrink-0 rounded border p-2 hover:bg-green-600 hover:text-white dark:border-violet-500"> Add new</button>
			</form>

			{#each whitelist_array as whitelist_item}
				<div class="mb-2 flex">
					<input class="flex-shrink border p-2 dark:text-black sm:mr-2" disabled value={whitelist_item} />
					<button
						class="w-28 flex-shrink-0 rounded border p-2 hover:bg-red-600 hover:text-white dark:border-violet-500"
						on:click={() => {
							removeWhiteListItem(whitelist_item)
						}}
					>
						Delete</button
					>
				</div>
			{/each}
		</div>
	{/if}
{/await}
