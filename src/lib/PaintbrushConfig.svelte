<script lang="ts">
  import Brush from "lucide-svelte/icons/brush";
  import { Slider } from "$lib/components/ui/slider/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  
  import { brushSize } from "$lib/store";

  const onValueChange = (value: number[]) => {
    brushSize.set(value[0]);
  };
</script>
 
<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button builders={[builder]} variant="outline" class="w-24 justify-between">
      <Brush class='w-5' />
      <span class="ml-4">{$brushSize}</span>
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