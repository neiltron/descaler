<script lang="ts">
  import { onMount } from 'svelte';
  import { brushSize, canvas, ctx, compressionQuality, hasImage } from '$lib/store';
  import DropZone from './Dropzone.svelte';

  onMount(() => {
    $ctx = $canvas?.getContext('2d');
  });

  function compressArea(x: number, y: number, brushSize: number, quality: number) {
    const startX = x - brushSize / 2;
    const startY = y - brushSize / 2;
    const imageData = $ctx?.getImageData(startX, startY, brushSize, brushSize);

    if (!imageData) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = brushSize;
    tempCanvas.height = brushSize;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx?.putImageData(imageData, 0, 0);

    const compressedDataUrl = tempCanvas.toDataURL('image/jpeg', quality);
    const img = new Image();
    img.onload = function() {
      $ctx?.clearRect(startX, startY, brushSize, brushSize);
      $ctx?.drawImage(img, startX, startY, brushSize, brushSize);
    };
    img.src = compressedDataUrl;
  }

  function handleMouseMove(event: MouseEvent) {
    if (event.buttons !== 1) return;

    const rect = $canvas?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.floor(event.clientX - rect.left);
    const y = Math.floor(event.clientY - rect.top);

    compressArea(x, y, $brushSize, $compressionQuality);
  }
</script>

<canvas 
  class="mt-6 ml-auto mr-auto"
  bind:this={$canvas} 
  on:mousemove={handleMouseMove} 
  hidden={!$hasImage}
></canvas>

{#if !$hasImage}
  <DropZone />
{/if}

<style lang="postcss">
</style>