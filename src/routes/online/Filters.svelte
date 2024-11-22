<script lang="ts">
  import '@fortawesome/fontawesome-free/css/fontawesome.css';
  import '@fortawesome/fontawesome-free/css/solid.css';
  import type { Filters } from './types';
  import Toggle3 from './Toggle3.svelte';
  import { setHash } from './utils';

  export let filters: Filters;
  export let filtered: number;
  export let total: number;

  $: {
    setHash(filters);
  }

</script>


<div class="flex m-2 justify-between">
  <div class="flex flex-row align-left">
    <div class="float-left p-1 justify-start">Nodes: {filtered}/{total}</div>
  </div>
  <div class="flex-row flex justify-end">
    <!-- <Toggle3 classes="mr-1" bind:value={filters.sync}>Sync</Toggle3> -->
    <Toggle3 classes="mr-1" bind:value={filters.spv}>SPV</Toggle3>
    <Toggle3 classes="mr-1" bind:value={filters.fullnode}>Fullnode</Toggle3>
    <Toggle3 classes="mr-1" bind:value={filters.tree}>Tree</Toggle3>
    <Toggle3 classes="mr-1" bind:value={filters.main}>MainSeed</Toggle3>
    <Toggle3 classes="mr-1" bind:value={filters.generated}>GenSeed</Toggle3>
    <Toggle3 classes="mr-1" bind:value={filters.brontide}>Brontide</Toggle3>
    <div class="flex-col">
      <button class="btn variant-filled-primary p-1 pr-3 pl-3" on:click={() => {
        window.location.hash = '';
      }}>Reset</button>
    </div>
  </div>
</div>
