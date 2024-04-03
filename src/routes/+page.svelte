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

<main>
  <header class="mb-6">
    <h1 class="text-3xl font-bold ">Descaler</h1>
    <h2>Drawing with compression.</h2>
  </header>

  {#if $hasImage}
  <Card>
    <nav class="m-2 text-sm flex justify-between items-center">
      <div class="flex justify-between w-full">
        <div>
          <PaintbrushConfig />
          <QualityConfig />
        </div>
        <div>
          <Button variant="destructive" on:click={() => hasImage.set(false)}>Reset</Button>
          <Button variant="default" on:click={() => $canvas?.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'descaler.png';
            a.click();
            URL.revokeObjectURL(url);
          })}>Save image</Button>
        </div>
      </div>
    </nav>
  </Card>
  {/if}
  
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
    padding: 40px 20px;
    height: stretch;
    box-sizing: content-box;
  }
</style>