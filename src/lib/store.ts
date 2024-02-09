import { writable } from 'svelte/store';

export const hasImage = writable<boolean>(false);
export const isDroppable = writable<boolean>(false);
export const canvas = writable<HTMLCanvasElement | null>(null);
export const ctx = writable<CanvasRenderingContext2D | null | undefined>(null);