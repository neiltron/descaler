<script lang="ts">
  import { onMount } from 'svelte';
  import { canvas, ctx, image, hasImage, isDroppable } from '$lib/store';
  import { Card } from "$lib/components/ui/card";

  let dropzoneRef: HTMLDivElement;

  onMount(() => {
    $ctx = $canvas?.getContext('2d');
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragOver);
    window.addEventListener('drop', handleDrop);
  });

  function drawImage() {
    if (!$canvas || !$image) return;
    const scaleFactor = 800 / $image.width;
    const width = Math.min(800, $image.width);
    $canvas.width = width;
    $canvas.height = $image.height * scaleFactor;
    $ctx?.drawImage($image, 0, 0, $canvas.width, $canvas.height);
  }

  function loadImage(file: File | null) {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        $image = new Image();
        $image.onload = () => drawImage();
        $image.src = e.target?.result;
      };
      reader.readAsDataURL(file);

      $hasImage = true;
    }
  }

  function handleFileSelect(event: Event & { target: HTMLInputElement | null }) {
    const file = event.target?.files![0];

    if (file) {
      loadImage(file);
    }
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];

    if (file) {
      loadImage(file);
    }
  }

  function handleDragOver(event: Event) {
    event.preventDefault();

    $isDroppable = event.type === 'dragover';
    dropzoneRef.classList.toggle('border-stone-500', $isDroppable);
  }

  function triggerFileSelect() {
    const fileInput = document.getElementById('file');
    fileInput?.click();
  }
</script>

<Card class="w-full">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    id="dropzone"
    role="button"
    tabindex="0"
    class="border-2 border-dashed border-gray-300 hover:border-gray-500 rounded-lg m-20 text-center"
    on:dragover={handleDragOver}
    on:drop={handleDrop}
    on:click={triggerFileSelect}
    bind:this={dropzoneRef}
  >
    <form>
      <input
        class="hidden"
        type="file"
        id="file"
        accept="image/*"
        on:change={handleFileSelect}
        title="Upload an image"
      >
      <label for="file">Select an image</label>
    </form>
    {#if !$isDroppable}
      <p class="mt-0.5">Or drop one here</p>
    {:else}
      <p class="mt-0.5">Drop it</p>
    {/if}
  </div>
</Card>

<style lang="postcss">
  #dropzone {
    font-family: Avenir, "Helvetica Neue", Lato, "Segoe UI", Helvetica, Arial, sans-serif;
    height: 500px;
    max-height: 50vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    letter-spacing: -.1px;
    cursor: crosshair;
  }

  #dropzone input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    z-index: -1;
  }

  #dropzone label {
    cursor: pointer;
    font-size: 1.5rem;
    font-weight: 500;
  }

  #dropzone p {
    font-size: 1rem;

  }
</style>