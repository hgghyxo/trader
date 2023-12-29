<script lang="ts">
import type { TabOptions } from './types'
import { onMount } from 'svelte'
export let tabOptions: TabOptions[]
export let tab = 1

function saveTab() {
	setTimeout(() => {
		localStorage.setItem('tab', String(tab))
	}, 0)
}

onMount(() => {
	if (localStorage.getItem('tab')) {
		tab = Number(localStorage.getItem('tab'))
	}
})
</script>

<div class="m-4 me-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
	{#each tabOptions as tabOption}
		<label class="me-2 inline-block rounded-lg px-4 py-3 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white" class:active={tab == tabOption.value}>
			<input type="radio" name="tab" value={tabOption.value} class="hidden" on:change={saveTab} bind:group={tab} />{tabOption.title}
		</label>
	{/each}
</div>

<style>
.active {
	@apply bg-blue-600 text-white;
}
</style>
