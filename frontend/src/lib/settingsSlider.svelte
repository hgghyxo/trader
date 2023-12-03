<script lang="ts">
  export let name: string,
    min: string,
    max: string,
    step: string = "1",
    value: any
</script>

<div>
  <label>
    <input type="range" {name} {min} {max} {step} bind:value />
    <input type="number" {name} {min} {max} {step} bind:value class="w-12" />
    {name}
  </label>
</div>
