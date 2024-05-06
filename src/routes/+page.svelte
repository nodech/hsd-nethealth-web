<script lang="ts">
  /*
  import { onMount, onDestroy, setContext } from 'svelte';
  */

  import ActiveNodes from './ActiveNodes.svelte';
  import ActiveNodesGraph from './ActiveNodesGraph.svelte'
  import Versions from './Versions.svelte';

  const classes = 'm-3 md:m-0 md:mt-2';
</script>

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
    <div class="card">
      <ActiveNodes />
    </div>
  </div>
  <div class="{classes} md:col-span-1 xl:col-span-2">
    <div class="card">
      <ActiveNodesGraph />
    </div>
  </div>
  <div class="{classes}">
    <div class="card">
      <Versions />
    </div>
  </div>
</div>
