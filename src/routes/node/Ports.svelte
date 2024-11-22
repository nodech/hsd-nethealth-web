<script lang="ts">
  export let host: string | null;
  export let port: number | null;
  export let ports: number[] | null | undefined;

  let hostValue = host;
</script>

<div class="flex mt-2">
  <div class="mt-2 flex-1">
    {#if ports}
      Avilable ports:
      {#each ports as c}
        <a
          href="?port={c}&host={host}"
          class="chip {port === c ? 'variant-filled' : 'variant-soft'}">
          <span>{c}</span>
        </a>
      {/each}
    {/if}
  </div>
  <div>
    <div class="input-group input-group-divider grid-cols-[1fr_auto]">
      <input class="p-2 pt-1 pb-1" type="text" bind:value={hostValue} />
      <a
        class="variant-filled-secondary"
        href="?port={port}&host={hostValue}"
      >Go</a>
    </div>
  </div>
</div>
