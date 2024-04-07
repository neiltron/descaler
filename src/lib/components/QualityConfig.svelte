<script lang="ts">
  import ImageDown from "lucide-svelte/icons/image-down";
  import { Slider } from "$lib/components/ui/slider/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  
  import { compressionQuality } from "$lib/store";

  export let className: string = '';

  const onValueChange = (value: number[]) => {
    compressionQuality.set(value[0]);
  };
</script>
 
<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button builders={[builder]} variant="outline" class="w-[80px] justify-between">
      <ImageDown class='w-5' />
      <span class="ml-1">{$compressionQuality}</span>
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56" align="start">
    <DropdownMenu.Label class="flex justify-between gap-2">
      <span>JPEG Quality</span>
    </DropdownMenu.Label>
    <DropdownMenu.Label class="flex justify-between gap-2">
      <Slider value={[$compressionQuality]} max={1} step={.01} class="w-full" onValueChange={onValueChange} />
    </DropdownMenu.Label>
  </DropdownMenu.Content>
</DropdownMenu.Root>