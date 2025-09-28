import { useState, useEffect, useCallback } from 'react'

interface Router {
  path: string
  navigate: (newPath: string) => void
}

export function useRouter(): Router {
  const [path, setPath] = useState<string>(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname)

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = useCallback((newPath: string): void => {
    window.history.pushState({}, '', newPath)
    setPath(newPath)
  }, [])

  return { path, navigate }
}
