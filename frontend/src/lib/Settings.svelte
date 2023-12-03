<script lang="ts">
  import { db } from './firebase'
  import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
  import SettingsSlider from './settingsSlider.svelte'

  let minimumKeepAmmount: number,
    minimalBuyAmmountInUSD: number,
    sellMargin: number,
    trailingDelta: number,
    LastHourPricePercentChanged: number,
    SellWithTakeProfitLimitOrder: boolean = true

  const loading = load()

  function load() {
    let resolve = undefined
    const promise = new Promise((r) => (resolve = r))
    const done = () => resolve()
    const wait = () => promise

    return { done, wait }
  }

  const settingsRef = doc(db, 'backend/settings')

  const update = (event) => {
    let updated
    if (event.target.type == 'checkbox') {
      updated = JSON.parse('{"' + event.target.name + '":' + event.target.checked + '}')
    } else {
      updated = JSON.parse('{"' + event.target.name + '":' + event.target.value + '}')
    }
    console.log(updated)

    updateDoc(settingsRef, updated)
  }

  onSnapshot(settingsRef, (doc) => {
    const settings = doc.data()
    loading.done()

    minimumKeepAmmount = settings.minimumKeepAmmount
    minimalBuyAmmountInUSD = settings.minimalBuyAmmountInUSD
    sellMargin = settings.sellMargin
    trailingDelta = settings.trailingDelta
    LastHourPricePercentChanged = settings.LastHourPricePercentChanged
    SellWithTakeProfitLimitOrder = settings.SellWithTakeProfitLimitOrder
  })
</script>

{#await loading.wait()}
  Loading ...
{:then}
  <form on:change={update}>
    <SettingsSlider name="minimalBuyAmmountInUSD" min="10" max="100" value={minimalBuyAmmountInUSD} />
    <SettingsSlider name="minimumKeepAmmount" min="0" max="100" value={minimumKeepAmmount} />
    <SettingsSlider name="sellMargin" min="0.01" max="0.1" step="0.01" value={sellMargin} />
    <SettingsSlider name="trailingDelta" min="100" max="500" step="100" value={trailingDelta} />
    <SettingsSlider name="LastHourPricePercentChanged" min="1" max="20" value={LastHourPricePercentChanged} />
    <label
      ><input
        name="SellWithTakeProfitLimitOrder"
        type="checkbox"
        bind:checked={SellWithTakeProfitLimitOrder} />SellWithTakeProfitLimitOrder</label>
  </form>
{/await}
