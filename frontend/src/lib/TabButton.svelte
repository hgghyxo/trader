<script lang="ts">
	type option = { value: number; title: string }

	export let options: option[]
	export let tab = 1
</script>

<div class="m-4 me-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
	{#each options as option}
		<label class="me-2 inline-block rounded-lg px-4 py-3 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white" class:active={tab == option.value}>
			<input type="radio" name="tab" value={option.value} class="hidden" bind:group={tab} />{option.title}
		</label>
	{/each}
</div>

<style>
	.active {
		@apply bg-blue-600 text-white;
	}
</style>
