<script lang="ts">
import { db } from './firebase'
import { doc, collection, onSnapshot, deleteDoc, Timestamp, addDoc, orderBy, query } from 'firebase/firestore'

let bannedSymbols: { symbol: string; timestamp: string; id: string; expireDate: Date; manual?: boolean }[] = []
const bannedSymbolsRef = collection(db, '/bannedSymbols')
const q = query(bannedSymbolsRef, orderBy('timestamp'))
const settingsRef = doc(db, 'backend/settings')
let hoursToBanSymbols: number

onSnapshot(settingsRef, (doc) => {
	const settings = doc.data()
	if (settings) {
		hoursToBanSymbols = settings.hoursToBanSymbols
	}
})

onSnapshot(q, (querySnapshot) => {
	bannedSymbols = []
	querySnapshot.forEach((doc) => {
		const bannedListSnapshot = doc.data()
		bannedListSnapshot.id = doc.id
		const DateFromTimestamp = bannedListSnapshot.timestamp.toDate()
		bannedListSnapshot.expireDate = new Date(DateFromTimestamp.setHours(DateFromTimestamp.getHours() + hoursToBanSymbols)).toLocaleString('hu-HU', { dateStyle: 'short', timeStyle: 'short' })
		//@ts-ignore
		bannedSymbols.push(bannedListSnapshot)
	})
	bannedSymbols = bannedSymbols
})

const deleteBannedSymbol = (id: string) => {
	deleteDoc(doc(db, 'bannedSymbols', id))
	return null
}

let symbol: string,
	expiryDate: string = '2030-01-01'

const addBannedSymbol = () => {
	addDoc(bannedSymbolsRef, {
		symbol: symbol.toLocaleUpperCase(),
		timestamp: Timestamp.fromDate(new Date(expiryDate)),
		manual: true
	})
}
</script>

<h1 class="pt-6 text-2xl font-bold">Banned Symbols:</h1>
<div class="mb-2">
	<form class="mb-2 flex" on:submit|preventDefault={addBannedSymbol}>
		<input class="flex-shrink border p-2 dark:text-black sm:mr-2" name="symbol" bind:value={symbol} placeholder="Symbol" />
		<input class="w-40 border p-2 dark:text-black sm:mr-2" name="timestamp" bind:value={expiryDate} type="date" />
		<button class="w-20 flex-shrink-0 rounded border p-2 hover:bg-green-600 hover:text-white dark:border-violet-500"> Add new</button>
	</form>

	{#each bannedSymbols as bannedSymbol}
		<div class="mb-2 flex">
			<input class="flex-shrink border p-2 dark:text-black sm:mr-2" disabled value={bannedSymbol.symbol} class:bg-blue-300={bannedSymbol.manual} />
			<input class="w-40 border p-2 dark:text-black sm:mr-2" disabled value={bannedSymbol.expireDate} class:bg-blue-300={bannedSymbol.manual} />
			<button
				class="w-20 flex-shrink-0 rounded border p-2 hover:bg-red-600 hover:text-white dark:border-violet-500"
				class:bg-blue-300={bannedSymbol.manual}
				on:click={deleteBannedSymbol(bannedSymbol.id)}
			>
				Delete</button
			>
		</div>
	{/each}
</div>
