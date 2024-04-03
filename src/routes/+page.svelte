<script>
  import ImageCanvas from '../lib/ImageCanvas.svelte';
  import { canvas, hasImage } from '$lib/store';
	import PaintbrushConfig from '$lib/PaintbrushConfig.svelte';
	import QualityConfig from '$lib/QualityConfig.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

  import {
    Card,
  } from "$lib/components/ui/card";
</script>

<Card class="bg-gray-800 fixed top-0 left-0 w-full">
  <header class="p-4 align-middle">
    <h1 class="text-1xl uppercase font-bold text-slate-50">Descaler</h1>

    <div>
      <PaintbrushConfig className="bg-gray-200" />
      <QualityConfig className="bg-gray-200" />
    </div>

    <div>
        <Button
          variant="destructive"
          class={`image-buttons ${!$hasImage ? 'opacity-0' : ''}`}
          on:click={() => hasImage.set(false)}
        >Reset</Button>
        <Button
          variant="default"
          class={`image-buttons ${!$hasImage ? 'opacity-0' : ''}`}
          on:click={() => $canvas?.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'descaler.png';
            a.click();
            URL.revokeObjectURL(url);
          }
        )}>Save image</Button>
    </div>
  </header>
</Card>

<main>
  <ImageCanvas />
</main>

<style lang="postcss">
  :global(html, body) {
    background-color: theme(colors.gray.200);
    height: 100%;
    margin: 0;
    padding: 0;
  }

  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 120px 20px;
    height: stretch;
    box-sizing: content-box;
    display: flex;
    align-items: center;
  }

  header {
    display: flex;
    justify-content: space-between;
  }
  h1 {
    display: inline-block;
    align-self: center;
  }

  .image-buttons {
    opacity: 1;
    transition: opacity 2s ease-in-out;
  }
</style>