<script lang="ts">
	type option = { value: number; title: string }

	export let options: option[]
	export let tab = 1
</script>


<div class="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400 m-4 me-2">
	{#each options as option}
		<label class="inline-block me-2 px-4 py-3 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white" class:active={tab == option.value}>
			<input type="radio" name="tab" value={option.value} class="hidden" bind:group={tab} />{option.title}
		</label>
	{/each}
</div>

<style>
	.active {
		@apply text-white bg-blue-600;
	}
</style>
