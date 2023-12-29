<script lang="ts">
	export let name: string
	export let min: string
	export let max: string
	export let step: string = '1'
	export let value: number
</script>

<div class="mb-2">
	<label class="flex">
		<input class="m-2 w-40 shrink-0 sm:w-56" type="range" {name} {min} {max} {step} bind:value />
		<input class="m-2 w-10 shrink-0 rounded border pl-2 dark:border-violet-500 dark:bg-gray-900 sm:w-14" type="number" {name} {min} {max} {step} bind:value />
		<p class="my-auto">{name}</p>
	</label>
</div>
