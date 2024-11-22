<script lang="ts">
  import { NodeEntry } from '$lib/entry';
  import { formatNumber } from '$lib/utils/format';
  import { formatDateTime, isStale } from '$lib/utils/time';

  export let ip: string;
  export let port: string;
  export let entry: NodeEntry;
  export let isMainSeed: boolean;
  export let isGeneratedSeed: boolean;

  let details = null as NodeEntry['result'];
  let isStaleEntry = false;

  $: {
    details = entry.result;
    isStaleEntry = isStale(entry.time);
  }

  const keyClasses = 'flex justify-center items-center';
  const valueClasses = 'flex justify-center items-center';
  const keyClasses2 = 'flex justify-center items-center key';
  const valueClasses2 = 'flex justify-center items-center value';
  const btnClasses = 'btn-icon w-5 h-5';
  const supClasses = 'text-xs';
</script>

<!-- just for typescript/redundant if -->
{#if entry && details}
<div class="card sm:mt-3 md:m-0 {isStaleEntry ? 'text-gray-500' : ''}">
  <div class="grid grid-cols-4 grid-rows-5">
    <a href="./node?port={port}&host={ip}" class="group">
      <div class="col-span-4 col-start-1 row-start-1 relative
                  min-h-12 flex items-center justify-center text-xl">
          {ip}:{port}
          {#if isMainSeed}
            <sup
              class="{supClasses}"
              class:variant-soft-success={!isStaleEntry}
              class:!text-gray-500={isStaleEntry}>
              Main Seed
            </sup>
          {/if}
          {#if isGeneratedSeed}
            <sup
              class="{supClasses}"
              class:variant-soft-success={!isStaleEntry}
              class:!text-gray-500={isStaleEntry}>
              Gen Seed
            </sup>
          {/if}
      </div>
    </a>
    <div class="group">
      <div class="col-span-1 col-start-1 row-start-2 {keyClasses}">Agent</div>
      <div class="col-span-3 col-start-2 row-start-2 {valueClasses}">{details.agent} </div>
    </div>
    <div class="group">
      <div class="col-span-1 col-start-1 row-start-3 {keyClasses}">Height</div>
      <div class="col-span-3 col-start-2 row-start-3 {valueClasses}">{formatNumber(details.height)} </div>
    </div>
    <div class="group">
      <div class="col-span-1 col-start-1 row-start-4 {keyClasses2}">Sync</div>
      <div class="col-span-1 col-start-1 row-start-5 {valueClasses2}">
        <i
          class="{btnClasses}"
          class:bg-green-500={details.canSync()}
          class:bg-red-500={!details.canSync()}
          class:!bg-gray-500={isStaleEntry}
          />
      </div>
    </div>

    <div class="group">
      <div class="col-span-1 col-start-2 row-start-4 {keyClasses2}">SPV</div>
      <div class="col-span-1 col-start-2 row-start-5 {valueClasses2}">
        <i
          class="{btnClasses}"
          class:bg-green-500={details.hasBloom()}
          class:bg-red-500={!details.hasBloom()}
          class:!bg-gray-500={isStaleEntry}
          />
      </div>
    </div>

    <div class="group">
      <div class="col-span-1 col-start-3 row-start-4 {keyClasses2}">FullNode</div>
      <div class="col-span-1 col-start-3 row-start-5 {valueClasses2}">
        <i
          class="{btnClasses}"
          class:bg-green-500={!details.pruned}
          class:bg-red-500={details.pruned}
          class:!bg-gray-500={isStaleEntry}
          />
      </div>
    </div>

    <div class="group">
      <div class="col-span-1 col-start-4 row-start-4 {keyClasses2}">Tree</div>
      <div class="col-span-1 col-start-4 row-start-5 {valueClasses2}">
        <i
          class="{btnClasses}"
          class:bg-green-500={!details.treeCompacted}
          class:bg-red-500={details.treeCompacted}
          class:!bg-gray-500={isStaleEntry}
          />
      </div>
    </div>
  </div>
  <div class="text-sm m-1 flex justify-end items-end self-end">
    Last check: {formatDateTime(entry.time)}
  </div>
</div>
{/if}

<style>
.group {
  display: contents;
}

.grid > .group:hover > div {
  background-color: rgb(var(--color-surface-500) / 0.2)
}

.grid > .group > div {
  padding: 0.1rem 0.5rem 0.1rem 0.5rem;
}

.key {
  border-width: 1px;
  border-color: rgb(var(--color-surface-500) / 0.2);
  border-bottom-width: 0;
}

.value {
  border-width: 1px;
  border-color: rgb(var(--color-surface-500) / 0.2);
  border-top-width: 0;
}

</style>
