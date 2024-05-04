<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  console.log(data);
</script>

<!-- {#if data.hostFailed} -->
<!--   <div class="flex justify-center"> -->
<!--     <p class="text-red-500">Failed to get IP address "{data.hostname}"</p> -->
<!--   </div> -->
<!-- {:else if data.hostname} -->
<!--   <div class="flex justify-center"> -->
<!--     <p class="text-green-500">IP address: {data.hostname}</p> -->
<!--   </div> -->
<!-- {:else} -->
<!--   <div class="flex justify-center"> -->
<!--     <p class="text-yellow-500">Loading IP address {data.hostname}...</p> -->
<!--   </div> -->
<!-- {/if} -->
