<script lang="ts">
  import type { GeneralStatuses } from "$lib/files";

  export let data:GeneralStatuses | null;

  function countNodes(entry: Record<string, boolean>) {
    let count = 0;
    let reachable = 0;

    for (const value of Object.values(entry)) {
      count++;

      if (value === true)
        reachable++;
    }
    return {
      count,
      reachable
    }
  }

  type CountNodes = ReturnType<typeof countNodes>;
  type NullOrCount = CountNodes | null;

  function getColor(entry: NullOrCount) {
    if (!entry)
      return 'variant-ringed';

    const percent = entry.reachable / entry.count;

    if (percent === 1)
      return 'bg-green-500';

    if (percent >= 0.5)
      return 'bg-yellow-500';

    if (percent >= 0.25)
      return 'bg-orange-500';

    return 'bg-red-500';
  }

  let nodes: NullOrCount = null;
  let dns: NullOrCount = null;

  $: if (data) {
    dns = countNodes(data.dnsSeeds);
    nodes = countNodes(data.nodes);
  }
</script>

<span class="badge variant-soft-primary">
  <a href="/seeds">
    <i class="btn-icon w-2 text-sm mr-2 {getColor(nodes)}" /> seeds
  </a>
</span>
<span class="badge variant-soft-primary">
  <a href="/dns">
    <i class="btn-icon w-2 text-sm mr-2 {getColor(dns)}" /> dns
  </a>
</span>
