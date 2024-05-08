<script lang="ts">
  import type { NodesGeneralStatuses } from '$lib/types';
  import type { NodeGeneralStatuses } from './types';
  import { formatNumber } from '$lib/utils/format';
  import { formatDateTime } from '$lib/utils/time';
  import { NodeEntry } from '$lib/entry';

  export let status: NodeGeneralStatuses;
  export let host: string;
  export let port: number;

  let chosenStatus: NodesGeneralStatuses | undefined;
  let isUp = false;
  let lastStatus: NodeEntry;
  let lastUp: NodeEntry | undefined;

  $: {
    chosenStatus = status[port];

    if (chosenStatus) {
      isUp = chosenStatus.isUp;
      lastStatus = NodeEntry.fromJSON(chosenStatus.lastStatus);
      lastUp = chosenStatus.lastUp ? NodeEntry.fromJSON(chosenStatus.lastUp) : undefined;
    }
  }

  const keyClasses = 'flex justify-center';
  const valueClasses = 'flex justify-center';
  const btnClasses = 'btn-icon w-5 h-5';
</script>

<div class="min-h-14 flex items-center justify-center text-2xl font-bold">
  {host}:{port}
</div>

{#if !chosenStatus}
  <div class="flex items-center justify-center text-2xl font-bold">
    No data
  </div>
{:else}
<div class="grid grid-cols-2">
  <div class="group">
    <div class="{keyClasses}">Last check</div>
    <div class="{valueClasses}">{formatDateTime(lastStatus.time)}</div>
  </div>

  <div class="group">
    <div class="{keyClasses}"> Online</div>
    <div class="{valueClasses}">
      <i
        class="{btnClasses}"
        class:bg-green-500={chosenStatus.isUp}
        class:bg-red-500={!chosenStatus.isUp}
        />
    </div>
  </div>

  {#if isUp && lastStatus.result}
    <div class="group">
      <div class="{keyClasses}">Height</div>
      <div class="{valueClasses}">{formatNumber(lastStatus.result.height)}</div>
    </div>
    <div class="group">
      <div class="{keyClasses}">Agent</div>
      <div class="{valueClasses}">{lastStatus.result.agent}</div>
    </div>
    <div class="group">
      <div class="{keyClasses}"> Sync Enabled</div>
      <div class="{valueClasses}">
        <i
          class="{btnClasses}"
          class:bg-green-500={lastStatus.result.canSync()}
          class:bg-red-500={!lastStatus.result.canSync()}
          />
      </div>
    </div>
    <div class="group">
      <div class="{keyClasses}">Serves SPV</div>
      <div class="{valueClasses}">
        <i
          class="{btnClasses}"
          class:bg-green-500={lastStatus.result.hasBloom()}
          class:bg-red-500={!lastStatus.result.hasBloom()}
          />
      </div>
    </div>
    <div class="group">
      <div class="{keyClasses}">Full Node</div>
      <div class="{valueClasses}">
        <i
          class="{btnClasses}"
          class:bg-green-500={!lastStatus.result.pruned}
          class:bg-red-500={lastStatus.result.pruned}
          />
      </div>
    </div>
    <div class="group">
      <div class="{keyClasses}">Full Tree</div>
      <div class="{valueClasses}">
        <i
          class="{btnClasses}"
          class:bg-green-500={!lastStatus.result.treeCompacted}
          class:bg-red-500={lastStatus.result.treeCompacted}
          />
      </div>
    </div>
  {/if}

  {#if !isUp}
    <div class="group">
      <div class="{keyClasses}">Error</div>
      <div class="{keyClasses}">{lastStatus.error}</div>
    </div>
    <div class="group">
      <div class="{keyClasses}">Last Success</div>
      <div class="{valueClasses}">{lastUp ? formatDateTime(lastUp.time) : 'Unknown'}</div>
    </div>

    {#if lastUp && lastUp.result}
      <div class="group text-gray-500">
        <div class="{keyClasses}">Height</div>
        <div class="{valueClasses}">{formatNumber(lastUp.result.height)}</div>
      </div>
      <div class="group text-gray-500">
        <div class="{keyClasses}">Agent</div>
        <div class="{valueClasses}">{lastUp.result.agent}</div>
      </div>
      <div class="group text-gray-500">
        <div class="{keyClasses}">Sync Enabled</div>
        <div class="{valueClasses}">
          <i
            class="{btnClasses}"
            class:bg-green-900={lastUp.result.canSync()}
            class:bg-red-900={!lastUp.result.canSync()}
            />
        </div>
      </div>
      <div class="group text-gray-500">
        <div class="{keyClasses}">Serves SPV</div>
        <div class="{valueClasses}">
          <i
            class="{btnClasses}"
            class:bg-green-900={lastUp.result.hasBloom()}
            class:bg-red-900={!lastUp.result.hasBloom()}
            />
        </div>
      </div>
      <div class="group text-gray-500">
        <div class="{keyClasses}">Full Node</div>
        <div class="{valueClasses}">
          <i
            class="{btnClasses}"
            class:bg-green-900={!lastUp.result.pruned}
            class:bg-red-900={lastUp.result.pruned}
            />
        </div>
      </div>
      <div class="group text-gray-500">
        <div class="{keyClasses}">Full Tree</div>
        <div class="{valueClasses}">
          <i
            class="{btnClasses}"
            class:bg-green-900={!lastUp.result.treeCompacted}
            class:bg-red-900={lastUp.result.treeCompacted}
            />
        </div>
      </div>
    {/if}
  {/if}
</div>
{/if}

<style>
.group {
  display: contents;
}

.grid > .group:nth-child(odd) > div {
  background-color: rgb(var(--color-surface-500) / 0.05)
}

.grid > .group:hover > div {
  background-color: rgb(var(--color-surface-500) / 0.2)
}

.grid > .group > div {
  padding: 0.2rem 0.5rem 0.2rem 0.5rem;
  border-bottom-width: 1px;
  border-color: rgb(var(--color-surface-500) / 0.2)
}
</style>
