<script lang="ts">
  import type { Readable } from 'svelte/store';
  import { getContext } from 'svelte';

  import type { MainPage } from '$lib/files';
  import { percent } from '$lib/format';

  let countries: MainPage['countries'] = {};
  let total = 0;

  const mainPage = getContext<Readable<MainPage>>('mainPage');

  $: if ($mainPage) {
    countries = $mainPage.countries;
    total = $mainPage.reachable;
  }
</script>

<div class="table-container">
  <div class="h-11 text-center text-2xl font-bold">Countries</div>
  <table class="table table-hover">
    <thead>
      <tr>
        <th class="w-2/3">Country</th>
        <th>Nodes</th>
        <th>%</th>
      </tr>
    </thead>
    <tbody>
      {#if $mainPage}
        {#each Object.keys(countries) as country}
          <tr>
            <td>{country}</td>
            <td>{countries[country]}</td>
            <td>{percent(countries[country], total)}</td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>
