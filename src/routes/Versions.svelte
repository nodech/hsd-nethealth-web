<script lang="ts">
  import '@fortawesome/fontawesome-free/css/fontawesome.css';
  import '@fortawesome/fontawesome-free/css/solid.css';

  import {
    RadioGroup,
    RadioItem,
    TreeView,
    TreeViewItem,
    ConicGradient,

    modeCurrent,
    localStorageStore
  } from '@skeletonlabs/skeleton';

  import type { ConicStop } from '@skeletonlabs/skeleton';

  import type { Writable } from 'svelte/store';

  import type { NodesGeneral } from '$lib/files';

  import {
    getVersionColor,
    getCSSFromHSL
  } from '$lib/utils/color';

  import { percent } from '$lib/format';
  import { nodes } from '$lib/stores/general';

  type VersionTreeIndex = {
    [major: string]: {
      [minor: string]: {
        [patch: string]: number
      }
    }
  };

  type VersionTreeEntry = {
    version: {
      major: number,
      minor: number,
      patch: number
    },
    label: string,
    value: number,
    color: string,
    children: VersionTreeEntry[]
  };

  function indexTree(versions: NodesGeneral['upCounts']['version'], isWhite: boolean = false) {
    const tree: VersionTreeIndex = {};
    const majors: Map<string, number> = new Map();
    const minors: Map<string, number> = new Map();
    const final: VersionTreeEntry[] = [];

    for (const version of Object.keys(versions)) {
      const [major, minor, patch] = version.split('.');

      if (majors.has(major)) {
        const prev = majors.get(major) as number;
        majors.set(major, prev + versions[version]);
      } else {
        majors.set(major, versions[version]);
      }

      if (minors.has(`${major}.${minor}`)) {
        const prev = minors.get(`${major}.${minor}`) as number;
        minors.set(`${major}.${minor}`, prev + versions[version]);
      } else {
        minors.set(`${major}.${minor}`, versions[version]);
      }

      if (!tree[major]) {
        tree[major] = {};
      }

      if (!tree[major][minor]) {
        tree[major][minor] = {};
      }

      if (!tree[major][minor][patch]) {
        tree[major][minor][patch] = 0;
      }

      tree[major][minor][patch] += versions[version];
    }

    const sortFn = (a: VersionTreeEntry, b: VersionTreeEntry) => b.value - a.value;
    for (const major of Object.keys(tree)) {
      const nmajor = Number(major);
      const children: VersionTreeEntry[] = [];

      for (const minor of Object.keys(tree[major])) {
        const nminor = Number(minor);
        const grandchildren: VersionTreeEntry[] = [];

        for (const patch of Object.keys(tree[major][minor])) {
          const npatch = Number(patch);
          const version = {
            major: nmajor,
            minor: nminor,
            patch: npatch
          };

          const hsl = getVersionColor(version, isWhite);

          grandchildren.push({
            version: version,
            label: `${major}.${minor}.${patch}`,
            value: tree[major][minor][patch],
            color: getCSSFromHSL(hsl),
            children: []
          });
        }

        grandchildren.sort(sortFn);

        const version = {
          major: nmajor,
          minor: nminor,
          patch: -1
        };

        const hsl = getVersionColor(version, isWhite);
        children.push({
          version: version,
          label: `${major}.${minor}.x`,
          value: minors.get(`${major}.${minor}`) ?? 0,
          color: getCSSFromHSL(hsl),
          children: grandchildren,
        });
      }

      children.sort(sortFn);

      const version = {
        major: nmajor,
        minor: -1,
        patch: -1
      };

      const hsl = getVersionColor(version, isWhite);

      final.push({
        version: version,
        label: `${major}.x`,
        value: majors.get(major) ?? 0,
        color: getCSSFromHSL(hsl),
        children,
      });
    }

    final.sort(sortFn);

    return final;
  }

  function genConicStops(versionTree: VersionTreeEntry[], total: number) {
    const stops: ConicStop[] = [];

    let start = 0;
    let end = 0;

    for (const version of versionTree) {
      const frac = version.value / total;
      const perc = frac * 100;
      end += Math.round(perc);
      const hsl = getVersionColor(version.version, $modeCurrent);
      const color = getCSSFromHSL(hsl);

      stops.push({
        label: `v${version.label}`,
        color: color,
        start: start,
        end: end,
      });

      start = end;
    }

    return stops;
  }

  const treeStyles = {
    spacing: 'space-y-1',
    padding: 'py-1 px-1',
    indent: 'ml-4',
    class: 'pl-4'
  };

  const treeFormat = (label: string, value: number) => `v${label} - ${percent(value, total)} (${value})`;

  let versions: NodesGeneral['upCounts']['version'] = {};
  let versionTree: VersionTreeEntry[] = [];
  let total = 0;
  let conicStops: ConicStop[] = [];

  type VersionView = 'list' | 'tree' | 'piechart';
  const versionView: Writable<VersionView> = localStorageStore('mainPageVersionView', 'list');

  $: if ($nodes.general) {
    const isWhite = $modeCurrent;
    versions = $nodes.general.upCounts.version;
    total = $nodes.general.upCounts.total;
    versionTree = indexTree(versions, isWhite);
    conicStops = genConicStops(versionTree, total);
  }
</script>

<div class="flex flex-nowrap h-11">
  <div class="flex-initial grow-0">
    <RadioGroup display="flex" border="border-token border-surface-200-700-token" background="">
      <RadioItem
        active="variant-ghost-primary"
        hover="hover:variant-soft-primary"
        bind:group={$versionView}
        name="view"
        value={"list"}
      >
        <i class="fa-solid fa-list text-xs"></i>
      </RadioItem>
      <RadioItem
        active="variant-ghost-primary"
        hover="hover:variant-soft-primary"
        bind:group={$versionView}
        name="view"
        value={"tree"}
      >
        <i class="fa-solid fa-bars-staggered text-xs"></i>
      </RadioItem>
      <RadioItem
        active="variant-ghost-primary"
        hover="hover:variant-soft-primary"
        bind:group={$versionView}
        name="view"
        value={"piechart"}
      >
        <i class="fa-solid fa-chart-pie text-xs"></i>
      </RadioItem>
    </RadioGroup>
  </div>
</div>

{#if $versionView == 'list'}
<div class="table-container">
  <table class="table table-hover">
    <thead>
      <tr>
        <th class="w-2/3">Version</th>
        <th>Nodes</th>
        <th>%</th>
      </tr>
    </thead>
    <tbody>
      {#each Object.keys(versions) as version}
        <tr>
          <td>{version}</td>
          <td>{versions[version]}</td>
          <td>{percent(versions[version], total)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
{/if}

{#if $versionView == 'tree'}
  <TreeView open={false} {...treeStyles}>
    {#each versionTree as major}
      <TreeViewItem>
        <span style:color={major.color}>{treeFormat(major.label, major.value)}</span>
        <svelte:fragment slot="children">
          {#each major.children as minor}
            <TreeViewItem open={false}>
              <span style:color={minor.color}>{treeFormat(minor.label, minor.value)}</span>
              <svelte:fragment slot="children">
                {#each minor.children as patch}
                  <TreeViewItem>
                    <span style:color={patch.color}>
                      {treeFormat(patch.label, patch.value)}
                    </span>
                  </TreeViewItem>
                {/each}
              </svelte:fragment>
            </TreeViewItem>
          {/each}
        </svelte:fragment>
      </TreeViewItem>
    {/each}
  </TreeView>
{/if}

{#if $versionView == 'piechart'}
  <div class="flex justify-center">
    <ConicGradient width="w-48" stops={conicStops} legend></ConicGradient>
  </div>
{/if}
