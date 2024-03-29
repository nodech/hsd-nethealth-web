<script lang="ts">
  import Online from './Online.svelte';
  import CurrentlyOnline from './CurrentlyOnline.svelte';
</script>

<div class="mt-3 md:grid md:grid-cols-3 md:gap-2">
  <div class="card m-3 md:m-0 md:col-span-2">
    <Online />
  </div>
  <div class="card m-3 md:m-0">
    <CurrentlyOnline />
  </div>
</div>
