<script lang="ts">
  import { nodes } from '$lib/stores/general';
  import List from './List.svelte'

  const classes = "m-3 md:m-0 md:mt-2";
</script>

<div class="md:grid md:grid-cols-2 xl:grid-cols-2 md:gap-2">
  <div class="{classes}">
    <div class="card">
      <List
        title="Main Seeds {$nodes?.general?.mainSeeds.up}/{$nodes?.general?.mainSeeds.total}"
        statuses={$nodes?.general?.mainSeeds.statuses}
      />
    </div>
  </div>
  <div class="{classes}">
    <div class="card">
      <List
        title="Generated Seeds {$nodes?.general?.generatedSeeds.up}/{$nodes?.general?.generatedSeeds.total}"
        statuses={$nodes?.general?.generatedSeeds.statuses}
      />
    </div>
  </div>
</div>
