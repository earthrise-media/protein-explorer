<script lang="ts">
  import Modal from "$lib/components/Modal.svelte"
  import { userState } from "$lib/stores/state"

  $: inspectedFoodItem = $userState.itemInspecting
</script>

{#if inspectedFoodItem}
  <Modal close={() => ($userState.itemInspecting = null)}>
    <div class="flex align-center" slot="title">
      <div class="food-item-avatar bg-{inspectedFoodItem.colorId}" />
      <span>{inspectedFoodItem.name}</span>
    </div>
    <div class="food-info-card">
      {#each Object.entries(inspectedFoodItem) as [key, value]}
        <div class="food-info-card-cell">
          <span class="label">{key}</span>
          <span>{value}</span>
        </div>
      {/each}
    </div>
  </Modal>
{/if}

<style lang="sass">
.food-info-card
  display: grid
  grid-template-columns: 1fr 1fr 1fr
  gap: 0.5rem 0.5rem

.food-info-card-cell
  display: flex
  flex-direction: column

.food-item-avatar
  margin-right: 0.5em

</style>
