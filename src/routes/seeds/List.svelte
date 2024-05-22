<script lang="ts">
  import type { NodesGeneralStatusList } from '$lib/types';
  import { NodeEntry } from '$lib/entry';
  import { simpleTooltip } from '$lib/components/Tooltip';
  import { formatNumber } from '$lib/utils/format';
  import { formatDateTime } from '$lib/utils/time';

  export let statuses: NodesGeneralStatusList | null = null;
  export let title: string;

  type LocalStatuses = {
    isUp: boolean;
    lastUp: NodeEntry | null;
    lastStatus: NodeEntry;
  };

  let loading = true;
  let sorted: LocalStatuses[] = [];

  $: if (statuses) {
    loading = false;
    sorted = [];

    for (const portMappings of Object.values(statuses)) {
      const entries: LocalStatuses[] = [];

      for (const stats of Object.values(portMappings)) {
        entries.push({
          isUp: stats.isUp,
          lastStatus: NodeEntry.fromJSON(stats.lastStatus),
          lastUp: stats.lastUp ? NodeEntry.fromJSON(stats.lastUp) : null
        });
      }

      // brontide first
      entries.sort((a) => {
        return a.lastStatus.brontide ? 1 : -1;
      });

      sorted.push(...entries);
    }

    sorted = sorted;
  }

  const generateTitle = (entry: LocalStatuses) => {
    let info = [];

    info.push(`Seed: ${entry.lastStatus.hostPort}`)

    if (entry.lastStatus.result) {
      info.push(`Height: ${formatNumber(entry.lastStatus.result.height)}`);
      info.push(`Agent: ${entry.lastStatus.result.agent}`);
    } else if (entry.lastUp?.result) {
      info.push(`Last status: ${formatDateTime(entry.lastUp.time)}`)
      info.push(`Height: ${formatNumber(entry.lastUp.result.height)}`);
      info.push(`Agent: ${entry.lastUp.result.agent}`);
      info.push(`SPV: ${entry.lastUp.result.hasBloom() ? 'Yes' : 'No'}`);
      info.push(`Full: ${!entry.lastUp.result.pruned ? 'Yes' : 'No'}`);
      info.push(`Tree: ${!entry.lastUp.result.treeCompacted ? 'Yes' : 'No'}`);
    } else {
      info.push('Unknown status');
    }

    if (entry.lastStatus.error)
      info.push(`Error: ${entry.lastStatus.error}`);

    return info.map((i) => `<div>${i}</div>`).join('');
  };

  const allClasses = 'flex items-center justify-center font-mono';
  const headerClasses = 'text-nowrap text-lg';
  const group = 'contents';
  const itemClasses = 'item'

  // setup tooltip
  let tooltipDiv: HTMLDivElement | null = null;
</script>

<div class="card" bind:this={tooltipDiv}></div>

<div class="min-h-14 flex items-center justify-center text-2xl font-bold">{title}</div>
{#if loading}
  <div class="text-center">Loading...</div>
{:else if statuses}
  <div class="table-container">
    <div class="grid text-xs sm:text-sm md:text-base">
      <div class="{group}">
        <div class="{allClasses} {headerClasses}">Seed</div>
        <div class="{allClasses} {headerClasses}">Net</div>
        <div class="{allClasses} {headerClasses}">SPV</div>
        <div class="{allClasses} {headerClasses}">Full</div>
        <div class="{allClasses} {headerClasses}">Tree</div>
      </div>

      {#each sorted as entry}
        {#if tooltipDiv}
        <div
          class="{group} item"
          data-title={generateTitle(entry)}
          use:simpleTooltip={{tooltipDiv}}
        >
          {#if entry.lastStatus.brontide}
            <div
              class="{allClasses} {itemClasses} !justify-end"
              class:text-red-300={!entry.isUp}
              class:opacity-60={!entry.isUp}
              class:text-green-300={entry.isUp}
            >
              <a href="./node?port={entry.lastStatus.port}&host={entry.lastStatus.host}">
                  :{entry.lastStatus.port}
              </a>
            </div>
          {:else}
            <div
              class="{allClasses} {itemClasses} !justify-end"
              class:text-red-300={!entry.isUp}
              class:opacity-60={!entry.isUp}
              class:text-green-300={entry.isUp}
            >
              <a href="./node?port={entry.lastStatus.port}&host={entry.lastStatus.host}">
                {entry.lastStatus.hostPort}
              </a>
            </div>
          {/if}

          {#if !entry.isUp}
            <div class="{allClasses} {itemClasses}"><i class="btn-icon w-2 bg-gray-500" /></div>
            <div class="{allClasses} {itemClasses}"><i class="btn-icon w-2 bg-gray-500" /></div>
            <div class="{allClasses} {itemClasses}"><i class="btn-icon w-2 bg-gray-500" /></div>
            <div class="{allClasses} {itemClasses}"><i class="btn-icon w-2 bg-gray-500" /></div>
          {:else}
            <div class="{allClasses} {itemClasses}">
              <i
                class="btn-icon w-2"
                class:bg-green-500={!entry.lastStatus.result?.noRelay}
                class:bg-red-500={entry.lastStatus.result?.noRelay}
                />
            </div>
            <div class="{allClasses} {itemClasses}">
              <i
                class="btn-icon w-2"
                class:bg-green-500={entry.lastStatus.result?.hasBloom()}
                class:bg-red-500={!entry.lastStatus.result?.hasBloom()}
                />
            </div>
            <div class="{allClasses} {itemClasses}">
              <i
                class="btn-icon w-2"
                class:bg-green-500={!entry.lastStatus.result?.pruned}
                class:bg-red-500={entry.lastStatus.result?.pruned}
                />
            </div>
            <div class="{allClasses} {itemClasses}">
              <i
                class="btn-icon w-2"
                class:bg-green-500={!entry.lastStatus.result?.treeCompacted}
                class:bg-red-500={entry.lastStatus.result?.treeCompacted}
                />
            </div>
          {/if}
        </div>
        {/if}
      {/each}
    </div>
  </div>
{/if}

<style>
.grid {
  grid-template-columns: repeat(1, max-content) repeat(4, auto)
}


.grid > .item:nth-child(odd) > div {
  background-color: rgb(var(--color-surface-500) / 0.05)
}

.grid > .item:hover > div {
  background-color: rgb(var(--color-surface-500) / 0.2)
}

.grid > div > div {
  padding: 0.2rem 0.5rem 0.2rem 0.5rem;
  border-bottom-width: 1px;
  border-color: rgb(var(--color-surface-500) / 0.2)
}

</style>
