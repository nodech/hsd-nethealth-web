<script lang="ts">
  import type { NodesGeneral } from '$lib/files/nodes-general';
  import type { DNSGeneral } from '$lib/files/dns-general';
  import { isStale } from '$lib/utils/time';

  export let nodes:NodesGeneral | null;
  export let dns:DNSGeneral | null;

  function getColor(percent: number | null, time:number = 0) {
    if (!percent || isStale(time))
      return 'variant-ringed';

    if (percent === 1)
      return 'bg-green-500';

    if (percent >= 0.5)
      return 'bg-yellow-500';

    if (percent >= 0.25)
      return 'bg-orange-500';

    return 'bg-red-500';
  }

  let nodesFinal: number | null = null;
  let dnsFinal: number | null = null;

  $: if (dns) {
    dnsFinal = dns.up / dns.total;
  } else {
    dnsFinal = null;
  }

  $: if (nodes) {
    nodesFinal = nodes.mainSeeds.up / nodes.mainSeeds.total;
  } else {
    nodesFinal = null;
  }
</script>

<span class="badge variant-soft-primary">
  <a href="/seeds">
    <i class="btn-icon w-2 text-sm mr-2 {getColor(nodesFinal, nodes?.timestamp)}" /> seeds
  </a>
</span>
<span class="badge variant-soft-primary">
  <a href="/dns">
    <i class="btn-icon w-2 text-sm mr-2 {getColor(dnsFinal, dns?.timestamp)}" /> dns
  </a>
</span>
