import { writable } from "svelte/store"

type Id = number | string | undefined

export const activeToastId = writable<Id>(0)
