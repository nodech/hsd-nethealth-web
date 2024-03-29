<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  import type { DNSStatus } from "$lib/files";
  import { DNS_STATUS_BY_HOST } from "$lib/files";

  import { HOUR, formatDate } from "$lib/utils/time";
  import { fetchFile } from "$lib/utils/fetch";

  let statuses: {[key: string]: DNSStatus | undefined} = {
    'hs-mainnet.bcoin.ninja': undefined,
    'seed.easyhandshake.com': undefined
  };

  const formatOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: 'numeric'
  };

  const tooOld = Date.now() - HOUR;

  const fetchStatus = async (id: string) => {
    try {
      const data = await fetchFile(DNS_STATUS_BY_HOST, id);
      statuses = { ...statuses, [id]: data };
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (status?: DNSStatus) => {
    if (!status || status.timestamp < tooOld) {
      return "bg-gray-500";
    }

    if (status.lastStatus.info.error) {
      return "bg-red-500";
    }

    if (status.lastStatus.info.result != null) {
      return "bg-green-500";
    }

    return "bg-gray-500";
  };

  const showLastStatus = (status?: DNSStatus) => {
    if (!status) {
      return false;
    }

    return status.lastStatus.info.error || status.timestamp < tooOld;
  };

  const fetchAll = async () => {
    const promises = Object.keys(statuses).map((host) => fetchStatus(host));
    await Promise.all(promises);
  }

  fetchAll().catch(console.error);

  let interval: ReturnType<typeof setInterval>;

  onMount(() => {
    interval = setInterval(() => {
      fetchAll().catch(console.error);
    }, DNS_STATUS_BY_HOST.REFETCH_INTERVAL);
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<div class="h-11 text-center text-2xl font-bold">DNS lookups</div>

<dl class="list-dl">
  {#each Object.entries(statuses) as [host, status]}
    <div>
      <span class="badge">
        <i class="btn-icon w-2 text-sm mr-2 {getStatusColor(status)}" />
      </span>
      <span class="flex-auto">
        <dt>{host}</dt>
        {#if status && showLastStatus(status)}
          <dd>Last lookup: <time>{formatDate(status.lastUp, formatOptions)}</time></dd>
        {/if}
      </span>
    </div>
  {/each}
</dl>
