import { Code2Icon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { BaseButtonProps, Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { cn } from '~/lib/utils'
import Markdown from '../markdown'

type UsagePopoverProps = {
  className?: string
  style?: React.CSSProperties
  slug?: string
  triggerProps?: BaseButtonProps
  cdnContent: string
}

export default function UsagePopover({ className, style, slug, triggerProps, cdnContent }: UsagePopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button icon={<Code2Icon />} variant="ghost" {...triggerProps} />
      </PopoverTrigger>
      <PopoverContent className={cn('max-h-[500px] w-[600px] overflow-y-auto', className)} style={style}>
        <Tabs defaultValue="cdn" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cdn">CDN</TabsTrigger>
            {!!slug && <TabsTrigger value="hooks">Hooks</TabsTrigger>}
          </TabsList>

          <TabsContent value="cdn" className="prose mt-6">
            <Markdown>{cdnContent}</Markdown>
          </TabsContent>

          {!!slug && (
            <TabsContent value="hooks" className="prose mt-6">
              <Markdown>
                {`
- You can create this custom hook and provide your api key

~~~ts
import { useCallback, useEffect, useState } from 'react'

export default function useHueHarbor() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [variables, setVariables] = useState<Response['data']>([])

  const fetchAndUpdateCSS = useCallback(() => {
    setIsLoading(true)
    fetch("https://hue-harbor.imrohitsaini.in/api/cdn/raw/${slug}", {
      headers: {
        Authorization: "Bearer <REPLACE-WITH-YOUR-API-KEY>",
      },
    })
      .then((res) => res.json())
      .then((res: Response) => {
        res.data.forEach((variable) => {
          document.body.style.setProperty(variable.variableName, variable.value)
        })

        setVariables(res.data)
      })
      .catch(() => {
        setError('Something went wrong!')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [apiKey, paletteSlug])

  useEffect(
    function fetchVariables() {
      fetchAndUpdateCSS()
    },
    [fetchAndUpdateCSS],
  )

  return {
    isLoading,
    error,
    variables,
  }
}

~~~
`}
              </Markdown>
            </TabsContent>
          )}
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
