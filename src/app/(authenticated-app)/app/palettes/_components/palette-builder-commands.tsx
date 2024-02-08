import { PlusCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command'
import { usePaletteStore } from '~/stores'

export default function PaletteBuilderCommands() {
  const [isOpen, setIsOpen] = useState(false)

  const setAddVariableOpen = usePaletteStore((store) => store.setAddVariableOpen)

  useHotkeys('ctrl+k, meta+k', (e) => {
    e.preventDefault()
    setIsOpen(true)
  })

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found!</CommandEmpty>

        <CommandGroup>
          <CommandItem
            onSelect={() => {
              setIsOpen(false)
              setAddVariableOpen(true)
            }}
          >
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            <span>Add new variable</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
