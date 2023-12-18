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
		hoursToBanSymbols: number

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
		}
	})
</script>

{#await loading.wait()}
	Loading ...
{:then}
	<form on:change={update}>
		<SettingsSlider name="minimalBuyAmmountInUSD" min="10" max="100" value={minimalBuyAmmountInUSD} />
		<SettingsSlider name="minimumKeepAmmount" min="0" max="100" value={minimumKeepAmmount} />
		<SettingsSlider name="sellMargin" min="0.01" max="0.2" step="0.01" value={sellMargin} />
		<SettingsSlider name="trailingDelta" min="100" max="500" step="100" value={trailingDelta} />
		<SettingsSlider name="LastHourPricePercentChanged" min="1" max="20" value={LastHourPricePercentChanged} />
		<SettingsSlider name="hoursToBanSymbols" min="0" max="48" value={hoursToBanSymbols} />
		<label class=""><input class="m-2" name="SellWithTakeProfitLimitOrder" type="checkbox" bind:checked={SellWithTakeProfitLimitOrder} />SellWithTakeProfitLimitOrder</label>
	</form>
{/await}
