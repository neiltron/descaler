<script>
  import ImageCanvas from '../lib/ImageCanvas.svelte';
  import { canvas, hasImage } from '$lib/store';
	import PaintbrushConfig from '$lib/components/PaintbrushConfig.svelte';
	import QualityConfig from '$lib/components/QualityConfig.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
  import Cursor from '$lib/components/ui/Cursor.svelte';

  import {
    Card,
  } from "$lib/components/ui/card";
</script>

<Card class="bg-gray-800 fixed top-[-5px] left-0 w-full">
  <header class="pl-4 pr-4 pb-4 pt-5 align-middle">
    <h1 class="text-1xl uppercase font-bold text-slate-50">Descaler</h1>

    <div class='config__items'>
      <PaintbrushConfig className="bg-gray-200" />
      <QualityConfig className="bg-gray-200" />
    </div>

    <div class='action__items'>
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

<Cursor />

<div id='byline'>
  Made by <a href='https://descend.org' target='_blank'>Neil Pullman</a>
</div>

<style lang="postcss">
  :global(html, body) {
    background-color: theme(colors.gray.200);
    min-height: stretch;
    margin: 0;
    padding: 0;
  }

  :global(body) {
    position: relative;
  }

  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 80px 20px;
    min-height: stretch;
    box-sizing: content-box;
    display: flex;
    align-items: center;
    flex-direction: column;
    z-index: 0
  }

  header {
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 1000;
  }
  h1 {
    display: inline-block;
    align-self: center;
  }

  header h1, header > div {
    width: 30%;
    display: flex;
  }

  .config__items {
    justify-content: center;
    gap: 8px;
  }

  .action__items {
    justify-content: flex-end;
    gap: 8px;
  }

  .image-buttons {
    opacity: 1;
    transition: opacity 2s ease-in-out;
  }

  #byline {
    position: absolute;
    bottom: 0;
    padding: 50px 10px 15px;
    font-size: 0.8rem;
    text-align: center;
    width: 100%;
  }
  #byline a {
    font-weight: 500;
  }
</style>