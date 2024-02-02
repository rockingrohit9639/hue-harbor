'use client'

import { Copy } from 'lucide-react'
import { cloneElement } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { api } from '~/trpc/react'

type CopyApiKeyProps = {
  className?: string
  style?: React.CSSProperties
  trigger?: React.ReactElement<{ onClick: () => void }>
  apiKeyId: string
}

export default function CopyApiKey({ className, style, apiKeyId, trigger }: CopyApiKeyProps) {
  const copyApiKeyMutation = api.apiKeys.copy.useMutation({
    onSuccess: (apiKey) => {
      navigator.clipboard
        .writeText(apiKey.value)
        .then(() => {
          toast.success('Api key copied successfully!')
        })
        .catch((error) => {
          toast.error(error?.message ?? 'Something went wrong!')
        })
    },
  })

  async function handleCopyKey() {
    copyApiKeyMutation.mutate(apiKeyId)
  }

  return (
    <>
      {trigger ? (
        cloneElement(trigger, { onClick: handleCopyKey })
      ) : (
        <Button
          className={className}
          style={style}
          icon={<Copy />}
          onClick={handleCopyKey}
          size="icon-sm"
          variant="outline"
          loading={copyApiKeyMutation.isLoading}
        />
      )}
    </>
  )
}
