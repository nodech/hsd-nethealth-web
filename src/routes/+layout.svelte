<script lang="ts">
  import type { PageData } from './$types';
	import '../app.postcss';
  import '@fortawesome/fontawesome-free/css/fontawesome.css';
  import '@fortawesome/fontawesome-free/css/brands.css';

  import { onMount } from 'svelte';
  import {
    AppShell,
    AppBar,
    LightSwitch,
    setInitialClassState
  } from '@skeletonlabs/skeleton';

  import HSDLogo from '$lib/components/Logos/HSD.svelte';

  import { invalidate } from '$app/navigation';
  import { GENERAL_STATUSES } from '$lib/files';
  import Status from './status.svelte';

  export let data: PageData;

  onMount(() => {
    setInitialClassState();

    setInterval(() => {
      invalidate(GENERAL_STATUSES.ID);
    }, GENERAL_STATUSES.REFETCH_INTERVAL);
  });
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
        <a href="/">
          <HSDLogo />
        </a>
        {#if data.generalStatuses}
          <span class="text-xl uppercase" title="Reachable Nodes">Nodes: {data.generalStatuses.reachable}</span>
        {/if}
			</svelte:fragment>
			<svelte:fragment slot="trail">
        <Status data={data.generalStatuses} />
        <a
          class="btn-icon btn-icon-md hover:variant-soft-primary"
          href="https://github.com/nodech/hsd-nethealth-web"
          target="_blank"
          rel="noreferrer"
        >
          <i class="fa-brands fa-github text-lg" />
        </a>
        <LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
  <div class="container mx-auto">
    <slot />
  </div>
</AppShell>
