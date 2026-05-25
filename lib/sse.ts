/**
 * lib/sse.ts
 */

type Listener = (data: string) => void

const listeners = new Set<Listener>()

export function subscribe(fn: Listener): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function broadcast(event: string, payload: unknown): void {
  const data = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`
  for (const fn of listeners) {
    try {
      fn(data)
    } catch {
      listeners.delete(fn)
    }
  }
}