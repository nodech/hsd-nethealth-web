<script lang="ts">
  import { nodes } from '$lib/stores/general'

  import type { UpCounts } from '$lib/types';
  import { percent } from '$lib/utils/format'

  let loading = true;
  let upCounts = null as UpCounts | null;

  $: if ($nodes.general) {
    upCounts = $nodes.general.upCounts
    loading = false
  }

  const formatPart = (value: number) => {
    if (!upCounts) return ''

    return percent(value, upCounts.total)
  }
</script>

<div class="min-h-14 flex items-center justify-center text-2xl font-bold">
  <a href="./online">Active Nodes</a>
</div>
<div class="table-container">
  {#if loading || !upCounts}
    <div class="text-center">Loading...</div>
  {:else}
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Node Status</th>
          <th>Count</th>
          <th>%</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Online</td>
          <td>{upCounts.total}</td>
          <td>100.00%</td>
        </tr>
        <tr>
          <td>Sync enabled</td>
          <td>{upCounts.canSync}</td>
          <td>{formatPart(upCounts.canSync)}</td>
        </tr>
        <tr>
          <td>Serves SPV Filters</td>
          <td>{upCounts.spv}</td>
          <td>{formatPart(upCounts.spv)}</td>
        </tr>
        <tr>
          <td>Full (non-pruned)</td>
          <td>{upCounts.total - upCounts.pruned}</td>
          <td>{formatPart(upCounts.total - upCounts.pruned)}</td>
        </tr>
        <tr>
          <td>Full Tree</td>
          <td>{upCounts.total - upCounts.compacted}</td>
          <td>{formatPart(upCounts.total - upCounts.compacted)}</td>
        </tr>
      </tbody>
    </table>
  {/if}
</div>
