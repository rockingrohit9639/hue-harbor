import { useEffect } from 'react'

export default function useUnsavedChanges(condition: boolean) {
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (condition) {
        e.preventDefault()
        return 'You have unsaved changes, are you sure you want to leave this page?'
      }

      return null
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [condition])
}
