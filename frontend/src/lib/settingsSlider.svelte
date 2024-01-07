<script lang="ts">
	export let name: string
	export let min: string
	export let max: string
	export let step: string = '1'
	export let value: number
</script>

<div class="mb-2">
	<label class="flex flex-wrap-reverse">
		<input class="m-2 w-full sm:w-56" type="range" {name} {min} {max} {step} bind:value />
		<input class="m-2 w-14 rounded border pl-2 dark:border-violet-500 dark:bg-gray-900" type="number" {name} {min} {max} {step} bind:value />
		<p class="my-auto inline">{name}</p>
	</label>
</div>
