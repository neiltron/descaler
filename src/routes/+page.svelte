<script>
  import ImageCanvas from '../lib/ImageCanvas.svelte';
</script>

<main>
  <h1 class="text-3xl font-bold mb-2">Descaler</h1>
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
    max-width: 700px;
    margin: 0 auto;
    padding: 40px 20px;
    height: fill-available;
  }
</style>