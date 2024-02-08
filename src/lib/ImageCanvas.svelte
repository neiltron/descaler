<script lang="ts">
  import { onMount } from 'svelte';
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let image: any = null;
  let hasImage = false;

  function loadImage(file: File) {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        image = new Image();
        image.onload = () => drawImage();
        image.src = e.target?.result;
      };
      reader.readAsDataURL(file);

      hasImage = true;
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
  }

  function drawImage() {
    if (!canvas || !image) return;
    const scaleFactor = Math.min(1, 700 / Math.max(image.width, image.height));
    canvas.width = image.width * scaleFactor;
    canvas.height = image.height * scaleFactor;
    ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
  }

  let BRUSH_SIZE = 40;
  let compressionQuality = 0.00000001;

  function compressArea(x: number, y: number, brushSize: number, quality: number) {
    const startX = x - brushSize / 2;
    const startY = y - brushSize / 2;
    const imageData = ctx?.getImageData(startX, startY, brushSize, brushSize);

    if (!imageData) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = brushSize;
    tempCanvas.height = brushSize;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx?.putImageData(imageData, 0, 0);
    const compressedDataUrl = tempCanvas.toDataURL('image/jpeg', quality);
    const img = new Image();
    img.onload = function() {
        ctx?.clearRect(startX, startY, brushSize, brushSize);
        ctx?.drawImage(img, startX, startY, brushSize, brushSize);
    };
    img.src = compressedDataUrl;
  }

  onMount(() => {
    ctx = canvas.getContext('2d');
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);
  });

  function handleMouseMove(event: MouseEvent) {
    if (event.buttons !== 1) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    compressArea(x, y, BRUSH_SIZE, compressionQuality);
  }
</script>

<input
  class="mb-4"
  type="file"
  accept="image/*"
  on:change={handleFileSelect}
>

<canvas bind:this={canvas} on:mousemove={handleMouseMove} hidden={!hasImage}></canvas>

{#if !hasImage}
  <div id="dropzone" class="border-2 border-dashed border-gray-400 p-4 text-center" on:dragover={handleDragOver} on:drop={handleDrop}>
    <p>Drop an image here</p>
  </div>
{/if}


<style lang="postcss">
  #dropzone {
    cursor: pointer;
    height: 500px;
    max-height: 50vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>