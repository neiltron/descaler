<script lang="ts">
  import Brush from "lucide-svelte/icons/brush";
  import { Slider } from "$lib/components/ui/slider/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  
  import { brushSize } from "$lib/store";

  export let className: string;

  const onValueChange = (value: number[]) => {
    brushSize.set(value[0]);
  };
</script>
 
<DropdownMenu.Root class={className}>
  <DropdownMenu.Trigger asChild let:builder>
    <Button builders={[builder]} variant="outline" class="w-[80px] justify-between">
      <Brush class='w-5' />
      <span class="ml-1">{$brushSize}</span>
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56" align="start">
    <DropdownMenu.Label class="flex justify-between gap-2">
      <span>Brush Size</span>
    </DropdownMenu.Label>
    <DropdownMenu.Label class="flex justify-between gap-2">
      <Slider value={[$brushSize]} max={200} step={2} class="w-full" onValueChange={onValueChange} />
    </DropdownMenu.Label>
  </DropdownMenu.Content>
</DropdownMenu.Root>