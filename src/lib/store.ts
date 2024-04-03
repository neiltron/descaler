import { writable } from 'svelte/store';

export const image = writable<HTMLImageElement | null>(null);
export const hasImage = writable<boolean>(false);
export const isDroppable = writable<boolean>(false);
export const canvas = writable<HTMLCanvasElement | null>(null);
export const ctx = writable<CanvasRenderingContext2D | null | undefined>(null);
export const brushSize = writable<number>(100); // pixel size, e.g. 1 - 100
export const compressionQuality = writable<number>(0); // 0.000001 - 1