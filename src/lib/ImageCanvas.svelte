<script lang="ts">
  import { onMount } from 'svelte';
  import { canvas, ctx, hasImage, isDroppable } from '$lib/store';

  let image: any = null;
  let dropzoneRef: HTMLDivElement;
  let COMPRESSION_QUALITY = 0.000001;
  let BRUSH_SIZE = 40;

  function loadImage(file: File) {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        image = new Image();
        image.onload = () => drawImage();
        image.src = e.target?.result;
      };
      reader.readAsDataURL(file);

      $hasImage = true;
    }
  }

  function handleFileSelect(event: Event & { target: HTMLInputElement }) {
    const file = event.target?.files[0];
    loadImage(file);
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

  function drawImage() {
    if (!$canvas || !image) return;
    let scaleFactor;
    let width;
    let height;

    if (image.width > 800) {
      scaleFactor = 800 / image.width;
      width = 800;
      height = image.height * scaleFactor;
    } else {
      scaleFactor = 1;
      width = image.width;
      height = image.height;
    }

    $canvas.width = width;
    $canvas.height = height;
    $ctx?.drawImage(image, 0, 0, width, height);
  }

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

  onMount(() => {
    $ctx = $canvas?.getContext('2d');
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragOver);
    window.addEventListener('drop', handleDrop);
  });

  function handleMouseMove(event: MouseEvent) {
    if (event.buttons !== 1) return;

    const rect = $canvas?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.floor(event.clientX - rect.left);
    const y = Math.floor(event.clientY - rect.top);

    compressArea(x, y, BRUSH_SIZE, COMPRESSION_QUALITY);
  }

  function triggerFileSelect() {
    const fileInput = document.getElementById('file');
    fileInput?.click();
  }
</script>

<canvas bind:this={$canvas} on:mousemove={handleMouseMove} hidden={!$hasImage}></canvas>

{#if !$hasImage}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    id="dropzone"
    role="button"
    tabindex="0"
    class="border-2 border-dashed border-gray-400 hover:border-gray-500 rounded-lg p-4 text-center"
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
{/if}


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
    cursor: pointer;
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