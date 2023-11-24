<script lang="ts">
  import { onMount } from "svelte"
  import { spring } from "svelte/motion"
  import { fade } from "svelte/transition"
  import { on } from "martha"

  let vw = 0
  let timeout: ReturnType<typeof setTimeout>
  let listeners: EventListener[]

  const coords = spring(
    { x: 0, y: 0 },
    {
      stiffness: 0.15,
      damping: 0.6
    }
  )

  let tooltip = {
    text: "",
    active: false,
    classList: "",
    duration: 1000
  }

  const enter = (e: InteractionEvent) => {
    const target = e.target as HTMLElement
    const isTouch = e.hasOwnProperty("targetTouches")

    if (!target?.dataset?.tooltip) {
      if (isTouch) leave(e)
      return
    }

    const { tooltip: text, classList = "" } = target.dataset

    clearTimeout(timeout)

    tooltip.active = true
    tooltip.classList = classList
    tooltip.text = text

    move(e)

    listeners = isTouch
      ? [on(e.target, "touchend", leave), on(e.target, "touchcancel", leave)]
      : [on(document, "mousemove", move), on(e.target, "mouseleave", leave)]
  }

  const move = (e: InteractionEvent) => {
    let x = 0
    let y = 0

    if (e.hasOwnProperty("targetTouches")) {
      const event = e as TouchEvent
      x = event.targetTouches[0].clientX
      y = event.targetTouches[0].clientY
    } else {
      const event = e as MouseEvent
      x = event.clientX
      y = event.clientY
    }

    coords.set({ x, y })
  }

  const leave = (e: InteractionEvent) => {
    tooltip.active = false
    timeout = setTimeout(cleanup, tooltip.duration)
  }

  const cleanup = (e: InteractionEvent) => {
    listeners.forEach((off) => off(e))
  }

  onMount(() => {
    document.addEventListener("mouseenter", enter, true)
    document.addEventListener("touchstart", enter, true)
  })
</script>

<svelte:window bind:innerWidth={vw} />

<div
  id="tooltip"
  style="left: {$coords.x}px; top: {$coords.y}px"
  class:bump-left={$coords.x > vw - 100}
  class:bump-right={$coords.x < 100}
  class="shadow-md"
>
  {#if tooltip.active}
    <div id="tooltip-body" class={tooltip.classList} transition:fade>
      {@html tooltip.text}
    </div>
  {/if}
</div>

<style lang="sass">
#tooltip
  position: fixed
  pointer-events: none
  user-select: none
  z-index: 10
  
#tooltip-body
  position: absolute
  top: 0
  left: 0
  padding: .5rem 1rem
  font-size: 14px
  font-weight: 500
  max-width: 200px
  width: max-content
  text-align: center
  border-radius: 2px
  color: var(--color-secondary-1)
  background: var(--color-primary-1)
  box-shadow: 0 4px 1.5rem #0008
  transform: translate(-50%, calc(-100% - 16px))
  transition: transform 0.3s

  .bump-right &
    transform: translate(0%, calc(-100% - 16px))

  .bump-left &
    transform: translate(-100%, calc(-100% - 16px))


:global([data-tooltip])
  cursor: pointer

</style>