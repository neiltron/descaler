<script lang="ts">
	import { onMount } from "svelte";
  import { browser } from '$app/environment';
  import { brushSize, canvas as mainCanvas, cursorHidden } from '$lib/store';

  let canvas: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = null;
  
  $: if (ctx && canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, $brushSize / 2, 0, 2 * Math.PI);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  $: if (browser) {
    if ($cursorHidden === true) {
      canvas?.style.setProperty('opacity', '0');
    } else {
      canvas?.style.setProperty('opacity', '1');
    }
  }

  $: if (browser && canvas !== null) {
    window.addEventListener('mousemove', handleMouseMove);
  } else if (browser) {
    window.removeEventListener('mousemove', handleMouseMove);
  }

  onMount(() => {
    if (canvas !== null) {
      canvas.width = 200;
      canvas.height = 200;
      ctx = canvas.getContext('2d');
    }
  });

  const handleMouseMove = (event: MouseEvent) => {
    if (canvas == null) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.pageX - rect.width / 2;
    const y = event.pageY - rect.height / 2;

    const brushSizeSlider = document.querySelector('.brush-size-slider');

    // transform x and y with css
    canvas.style.setProperty('--x', `${Math.floor(x)}px`);
    canvas.style.setProperty('--y', `${Math.floor(y)}px`);

    const brushSizeRect = brushSizeSlider?.getBoundingClientRect();
    const mouseIsInBrushSizeSlider = brushSizeRect && event.clientX >= brushSizeRect.left && event.clientX <= brushSizeRect.right && event.clientY >= brushSizeRect.top && event.clientY <= brushSizeRect.bottom;

    $cursorHidden = event.target !== $mainCanvas && !mouseIsInBrushSizeSlider;
  };
</script>

<div>
  <canvas bind:this={canvas}></canvas>
</div>

<style lang="postcss">
  div {
    mix-blend-mode:difference;
    z-index: 1000;
    position: absolute;
    top: 0;
    left: 0;
  }

  canvas {
    position: absolute;
    background-color: #000;
    top: 0;
    left: 0;
    width: 200px;
    height: 200px;
    pointer-events: none;
    z-index: 100;
    opacity: 0;
    transition: opacity 0.15s ease-in-out;
    transform: translateX(var(--x)) translateY(var(--y));
  }
</style>