<script lang="ts">
  import { page } from '$app/stores';

  console.log($page);
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
