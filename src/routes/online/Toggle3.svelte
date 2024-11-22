<script lang="ts">
  import type { BoolFilterState } from './types';
  import {
    BoolFilterAll,
    BoolFilterExclude,
    BoolFilterInclude
  } from './types';

  export let value: BoolFilterState = BoolFilterAll;
  export let classes: string = '';

  let icon = 'fa-circle';
  let style = 'variang-ghost';

  $: {
    switch (value) {
      case BoolFilterAll:
        icon = 'fa-circle';
        style = 'variant-ghost';
        break;
      case BoolFilterInclude:
        icon = 'fa-circle-check';
        style = 'variant-ghost-success'
        break;
      case BoolFilterExclude:
        icon = 'fa-circle-xmark';
        style = 'variant-ghost-error'
        break;
    }
  }

  function toggle3() {
    switch (value) {
      case BoolFilterAll:
        value = BoolFilterInclude;
        break;
      case BoolFilterInclude:
        value = BoolFilterExclude;
        break;
      case BoolFilterExclude:
        value = BoolFilterAll;
        break;
    }
  }
</script>

<div class="flex-col {classes}">
  <button type="button" class="btn {style} p-1" on:click={toggle3}>
    <span><slot /></span>
    <span><i class="fa-regular {icon} text-sm"></i></span>
  </button>
</div>
