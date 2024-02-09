<script>
  import ImageCanvas from '../lib/ImageCanvas.svelte';
  import { canvas, hasImage } from '$lib/store';
</script>

<main>
  <h1 class="text-3xl font-bold ">Descaler</h1>

  <nav class="mb-2 text-sm flex justify-between items-center">
    <h2>Drawing with compression.</h2>
    {#if $hasImage}
      <div>
        <button
          class="btn btn-gray"
          on:click={() => hasImage.set(false)}
        >Reset</button>
        <button
          class="btn btn-gray"
          on:click={() => $canvas?.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'descaler.png';
            a.click();
            URL.revokeObjectURL(url);
          })}
        >Save image</button>
      </div>
    {/if}
  </nav>
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
    height: fill-available;
    box-sizing: content-box;
  }

  .btn {
    @apply font-bold py-2 px-4 rounded;
  }
  .btn-gray {
    @apply bg-gray-500 text-white;
  }
  .btn-gray:hover {
    @apply bg-gray-600;
  }
</style>