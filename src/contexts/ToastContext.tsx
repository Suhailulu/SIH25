import React, { createContext, useContext, useState, useCallback } from 'react'

type Toast = { id: string; title?: string; message: string }

const ToastContext = createContext<{ toasts: Toast[]; push: (t: Omit<Toast, 'id'>) => void }>({ toasts: [], push: () => {} })

export function useToasts() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now().toString()
    setToasts((s) => [{ id, ...t }, ...s])
    // desktop notification
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try { new Notification(t.title || 'TransitJustice', { body: t.message }) } catch (e) { /* ignore */ }
    }
    // auto-remove
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 8000)
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, push }}>
      {children}
      <div aria-live="polite" aria-atomic="false" className="fixed bottom-6 right-6 z-50 w-[min(24rem,calc(100vw-2rem))] space-y-2">
        {toasts.map((t) => (
          <div key={t.id} className="p-3 bg-white shadow rounded border">
            {t.title && <div className="font-medium">{t.title}</div>}
            <div className="text-sm">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function requestNotificationPermission() {
  if (typeof Notification === 'undefined') return
  if (Notification.permission === 'default') Notification.requestPermission().catch(() => {})
}
