<script lang="ts">
  /*
  import { onMount, onDestroy, setContext } from 'svelte';
  */

  import Versions from './Versions.svelte';

  const classes = "card m-3 mt-3 md:m-0";
</script>

<div class="flex justify-center h-3">
<!-- {#if $loading} -->
<!--     <ProgressBar height="h-1" /> -->
<!-- {/if} -->
</div>

<!--
  max-w-screen-sm  max-width: 640px;
  max-w-screen-md  max-width: 768px;
  max-w-screen-lg  max-width: 1024px;
  max-w-screen-xl  max-width: 1280px;
  max-w-screen-2xl max-width: 1536px;
-->

<div class="md:grid md:grid-cols-2 xl:grid-cols-3 md:gap-2">
  <!-- <div class="{classes}"> -->
  <!--   <div class="h-11 text-center text-2xl font-bold">Countries</div> -->
  <!--   <Countries /> -->
  <!-- </div> -->
  <div class="{classes}">
    <div class="text-center text-2xl font-bold">Versions</div>
    <Versions />
  </div>
  <div class="{classes}">
    <div class="text-center text-2xl font-bold">Place Holder</div>
  </div>
</div>
